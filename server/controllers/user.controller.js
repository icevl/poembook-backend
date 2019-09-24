import httpStatus from 'http-status';
import db from '../../config/sequelize';
import wrapper from '../helpers/response';

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
 * @returns {User}
 */
function get(req, res) {
    return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
    const user = User.build({
        username: req.body.username
    });

    user.save()
        .then(savedUser => res.json(savedUser))
        .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
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

    User.paginate(options)
        .then(users => res.json(wrapper(users)))
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
