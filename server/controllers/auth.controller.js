import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import db from '../../config/sequelize';
import APIError from '../helpers/APIError';
import config from '../../config/config';

const User = db.User;

/**
 * Returns jwt token if valid email and password is provided
 */
function login(req, res, next) {
    User.findOne({
        where: { email: req.body.username, password: req.body.password }
    })
        .then(user => {
            const token = jwt.sign(
                {
                    id: user.id
                },
                config.jwtSecret
            );

            return res.json({
                id: user.id,
                email: user.email,
                token
            });
        })
        .catch(() => {
            const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
            return next(err);
        });
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

export default { login, getRandomNumber };
