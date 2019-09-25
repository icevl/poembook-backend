import jwt from 'jsonwebtoken';
import config from '../../config/config';

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

export default validateToken;
