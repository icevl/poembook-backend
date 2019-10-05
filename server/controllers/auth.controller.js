import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import httpStatus from 'http-status';
import db from '../../config/sequelize';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import { getAccountUsers } from '../helpers/auth';

const User = db.User;
const Account = db.Account;

async function getUserData(user) {
    const token = jwt.sign(
        {
            id: user.id
        },
        config.jwtSecret
    );

    const accountUsers = await getAccountUsers(user.account_id);

    return {
        id: user.id,
        name: user.name,
        login: user.login,
        account_users: accountUsers,
        token
    };
}

/**
 * Returns jwt token if valid email and password is provided
 */
function login(req, res, next) {
    User.findOne({
        where: { login: req.body.login, password: req.body.password }
    })
        .then(user => res.json(getUserData(user)))
        .catch(() => {
            const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
            return next(err);
        });
}

async function facebookLogin(req, res, next) {
    const token = req.body.token;
    const userId = req.body.user_id ? Number(req.body.user_id) : 0;
    let accountId;

    if (!token) {
        return next();
    }

    const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
    const data = await response.json();

    // DEBUG
    // const data = { id: '123' };

    if (!data.id) {
        return res.status(404).json({ error: 'Facebook rejected' });
    }

    const account = await Account.findOne({ where: { facebook_id: data.id } });

    if (!account) {
        const accountNew = await Account.create({ facebook_id: data.id });
        accountId = accountNew.id;
    } else {
        accountId = account.id;
    }

    const userOptions = {
        account_id: accountId
    };

    if (userId) {
        userOptions.id = userId;
    }

    const user = await User.findOne({ where: userOptions });

    if (user) {
        const userData = await getUserData(user);
        return res.json(userData);
    }

    const lastUser = await User.findOne({ limit: 1, order: [['id', 'DESC']] });
    let newUserId = 1;
    if (lastUser && lastUser.id) {
        newUserId = lastUser.id + 1;
    }

    User.create({ account_id: accountId, name: data.name, login: `poet${newUserId}` })
        .then(savedUser => {
            Account.increment('users_count', { where: { id: accountId } });
            return res.json(getUserData(savedUser));
        })
        .catch(e => next(e));

    return true;
}

async function auth(req, res) {
    if (!req.user || !req.user.id) {
        return res.status(404).json({ error: 'Invalid token' });
    }

    const accountUsers = await getAccountUsers(req.user.account_id);
    const user = { ...req.user, account_users: accountUsers };
    return res.json(user);
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
