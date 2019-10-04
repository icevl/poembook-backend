import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import httpStatus from 'http-status';
import db from '../../config/sequelize';
import APIError from '../helpers/APIError';
import config from '../../config/config';

const User = db.User;

function getUserData(user) {
    const token = jwt.sign(
        {
            id: user.id
        },
        config.jwtSecret
    );

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        login: user.login,
        token
    };
}

/**
 * Returns jwt token if valid email and password is provided
 */
function login(req, res, next) {
    User.findOne({
        where: { email: req.body.username, password: req.body.password }
    })
        .then(user => res.json(getUserData(user)))
        .catch(() => {
            const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
            return next(err);
        });
}

async function facebookLogin(req, res, next) {
    const token = req.body.token;

    if (!token) {
        return next();
    }

    const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
    const data = await response.json();

    if (data.id) {
        const user = await User.findOne({ where: { facebook_id: data.id } });
        if (user) {
            res.json(getUserData(user));
        } else {
            const lastUser = await User.findOne({ limit: 1, order: [['id', 'DESC']] });
            User.create({ facebook_id: data.id, name: data.name, login: `poet${lastUser.id + 1}` })
                .then(savedUser => res.json(getUserData(savedUser)))
                .catch(e => next(e));
        }
    }

    return true;
}

function auth(req, res) {
    if (!req.user || !req.user.id) {
        return res.status(404).json({ error: 'Invalid token' });
    }

    return res.json(req.user);
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
    // req.user is assigned by jwt middleware if valid token is provided
    return res.json({
        user: req.user,
        num: Math.random() * 100
    });
}

export default { login, getRandomNumber, facebookLogin, auth };
