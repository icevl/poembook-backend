import httpStatus from 'http-status';
import db from '../../config/sequelize';
import { findWithPaginate } from '../helpers/db';

const User = db.User;

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
    User.findById(id)
        .then(user => {
            if (!user) {
                const e = new Error('User does not exist');
                e.status = httpStatus.NOT_FOUND;
                return next(e);
            }
            req.user = user; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get user
 */
function get(req, res) {
    return res.json(req.user);
}

/**
 * Create new user
 */
async function create(req, res, next) {
    const user = {
        login: req.body.login,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    };

    const responseEmail = await User.findOne({ where: { email: user.email } });
    if (responseEmail) {
        return res.json({ code: 300, error: 'Email exists' });
    }

    const responseLogin = await User.findOne({ where: { login: user.login } });
    if (responseLogin) {
        return res.json({ code: 301, error: 'Login exists' });
    }

    User.create(user)
        .then(savedUser => res.json(savedUser))
        .catch(e => next(e));

    return true;
}

/**
 * Update existing user
 */
function update(req, res, next) {
    const user = req.user;
    user.username = req.body.username;
    user.mobileNumber = req.body.mobileNumber;

    user.save()
        .then(savedUser => res.json(savedUser))
        .catch(e => next(e));
}

/**
 * Get user list.
 */
function list(req, res, next) {
    const { page = 1 } = req.query;

    const options = {
        attributes: ['id', 'username'],
        paginate: 3,
        page,
        order: [['id', 'ASC']]
    };

    findWithPaginate(User, options)
        .then(users => res.json(users))
        .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
    const user = req.user;
    const username = req.user.username;
    user.destroy()
        .then(() => res.json(username))
        .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
