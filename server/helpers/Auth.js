import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import db from '../../config/sequelize';
import config from '../../config/config';
import APIError from '../helpers/APIError';

const User = db.User;

function validateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        next();
        return false;
    }

    const token = req.headers.authorization.split(' ')[1]; // Bearer <token>

    try {
        const result = jwt.verify(token, config.jwtSecret);
        const user = {
            id: result.id
        };

        req.user = user;
    } catch (error) {
        const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
        return next(err);
    }

    return next();
}

async function auth(req, res, next) {
    if (req.user && req.user.id) {
        const userId = req.user.id;

        const respose = await User.findOne({ where: { id: userId } });

        if (respose && respose.id) {
            req.user = {
                id: respose.id,
                email: respose.email
            };
            return next();
        }

        const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
        return next(err);
    }
    return next();
}

export default { validateToken, auth };
