import Sequelize from 'sequelize';
import db from '../../config/sequelize';
import attributes from '../helpers/attributes';
import config from '../../config/config';
import { findWithPaginate } from '../helpers/db';

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
    const options = {
        attributes: attributes.poem,
        include: [
            {
                model: db.Comment,
                as: 'comments',
                limit: 3,
                attributes: attributes.comment,
                include: { model: db.User, as: 'user', attributes: attributes.user }
            },
            { model: db.User, as: 'user', attributes: attributes.user }
        ],
        paginate: config.paginatorSize,
        page,
        order: [['id', 'DESC']],
        where: {
            user_id: {
                [Op.in]: subscriptions
            }
        }
    };

    Poem.increment('views_count', { where: { ...options.where, user_id: { [Op.not]: userId } } });

    findWithPaginate(Poem, options)
        .then(poems => res.json(poems))
        .catch(e => next(e));
}

export default { list };
