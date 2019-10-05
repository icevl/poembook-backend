import Sequelize from 'sequelize';
import db from '../../config/sequelize';
import { findWithPaginate, poemsQuery } from '../helpers/db';

const Poem = db.Poem;
const Subscription = db.Subscription;
const Op = Sequelize.Op;

async function getSubscriptions(userId) {
    // const response = await Subscription.cache('subscriptions').findAll({
    const response = await Subscription.findAll({
        where: { subscriber_id: userId },
        attributes: ['user_id']
    });

    return response.map(item => item.user_id);
}

async function list(req, res, next) {
    let userId = 0;

    if (req.user) {
        userId = req.user.id;
    }

    const subscriptions = await getSubscriptions(userId);
    subscriptions.push(userId); // me

    const { page = 1 } = req.query;
    const options = poemsQuery(page, {
        user_id: userId,
        friends: subscriptions,
        where: {
            user_id: { [Op.in]: subscriptions },
            is_active: true
        }
    });

    Poem.increment('views_count', { where: { ...options.where, user_id: { [Op.not]: userId } } });

    findWithPaginate(Poem, options)
        .then(poems => res.json(poems))
        .catch(e => next(e));
}

export default { list };
