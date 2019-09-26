import jwt from 'jsonwebtoken';
import db from '../../config/sequelize';
import config from '../../config/config';

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
    } catch (err) {
        throw new Error(err);
    }

    return next();
}

function auth(req, res, next) {
    if (req.user && req.user.id) {
        const userId = req.user.id;

        User.findOne({
            where: { id: userId }
        })
            .then(user => {
                req.user = {
                    id: user.id,
                    email: user.email
                };

                next();
            });
            // .catch(() => {
            //     return next();
            // });
    }
    return next();
}

export default { validateToken, auth };
