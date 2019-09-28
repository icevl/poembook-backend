import db from '../../config/sequelize';
import { findWithPaginate } from '../helpers/db';

const Subscription = db.Subscription;

/**
 * Get subscription
 */
function get(req, res) {
    return res.json(req.user);
}

/**
 * Create new subscription
 */
function create(req, res, next) {
    const subscription = {
        subscriber_id: req.user.id,
        user_id: req.body.user_id
    };

    Subscription.create(subscription)
        .then(savedSubscription => res.json(savedSubscription))
        .catch(e => next(e));
}

/**
 * Get subscriptions list.
 */
function list(req, res, next) {
    const { page = 1 } = req.query;

    const options = {
        attributes: ['id'],
        paginate: 3,
        page,
        order: [['id', 'ASC']]
    };

    findWithPaginate(Subscription, options)
        .then(users => res.json(users))
        .catch(e => next(e));
}

/**
 * Delete Subscription.
 */
function remove(req, res, next) {
    // const user = req.user;
    // const username = req.Subscription.username;
    // Subscription.destroy()
    //     .then(() => res.json(username))
    //     .catch(e => next(e));
    next();
}

export default { get, create, list, remove };
