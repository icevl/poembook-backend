import Sequelize from 'sequelize';
import db from '../../config/sequelize';
import wrapper from '../helpers/response';
import attributes from '../helpers/attributes';
import config from '../../config/config';

const Poem = db.Poem;
const Subscription = db.Subscription;
const Op = Sequelize.Op;

async function getSubscriptions(userId) {
    const response = await Subscription.findAll({
        raw: true,
        where: { subscriber_id: userId },
        attributes: ['user_id']
    });
    return response.map(item => item.user_id);
}

async function list(req, res, next) {
    const subscriptions = await getSubscriptions(req.user.id);

    subscriptions.push(req.user.id); // me

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

    Poem.paginate(options)
        .then(poems => res.json(wrapper(poems)))
        .catch(e => next(e));
}

export default { list };
