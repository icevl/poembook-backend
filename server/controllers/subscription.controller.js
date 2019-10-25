import db from '../../config/sequelize';
import { findWithPaginate } from '../helpers/db';
import { checkUser } from '../helpers/auth';

const Subscription = db.Subscription;
const User = db.User;

/**
 * Get subscription
 */
function get(req, res) {
    return res.json(req.user);
}

/**
 * Create new subscription
 */
async function create(req, res, next) {
    const subscription = {
        subscriber_id: req.user.id,
        user_id: Number(req.body.user_id)
    };

    const user = await User.findOne({ where: { id: subscription.user_id } });
    if (!user) {
        return res.status(404).json({ error: `User ${subscription.user_id} not found` });
    }

    const response = await Subscription.findOne({ where: subscription });
    if (response) {
        return res.status(404).json({ error: 'Subscription exists' });
    }

    Subscription.create(subscription)
        .then(savedSubscription => {
            if (savedSubscription.id) {
                User.increment('subscriptions_count', { where: { id: subscription.subscriber_id } });
                User.increment('subscribers_count', { where: { id: subscription.user_id } });
            }
            return res.json(savedSubscription);
        })
        .catch(e => next(e));

    return true;
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
 * Unsubscribe
 */
async function remove(req, res, next) {
    checkUser(req, res, next);
    const userId = req.params.userId;
    const response = await Subscription.findOne({ where: { user_id: userId, subscriber_id: req.user.id } });

    if (!response) {
        return res.status(404).json({ error: 'No subscription found' });
    }

    Subscription.destroy({
        where: {
            id: response.id
        }
    })
        .then(() => {
            User.decrement('subscriptions_count', { where: { id: req.user.id } });
            User.decrement('subscribers_count', { where: { id: userId } });
            return res.json({ success: true });
        })
        .catch(e => next(e));

    return true;
}

export default { get, create, list, remove };
