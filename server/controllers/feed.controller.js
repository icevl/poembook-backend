import Sequelize from 'sequelize';
import db from '../../config/sequelize';
import { findWithPaginate, poemsQuery } from '../helpers/db';
import { getFriendList } from '../helpers/user';

const Poem = db.Poem;
const Op = Sequelize.Op;

async function list(req, res, next) {
    let userId = 0;

    if (req.user) {
        userId = req.user.id;
    }

    const subscriptions = await getFriendList(userId);
    const { page = 1, daily } = req.query;
    const query = {
        user_id: userId,
        friends: subscriptions,
        where: {
            user_id: { [Op.in]: subscriptions },
            is_active: true
        }
    };

    /**
     * Daily poem filter
     */
    if (daily) {
        query.where.daily_id = Number(daily);
        delete query.where.user_id;
    }

    const options = poemsQuery(page, query);
    Poem.increment('views_count', { where: { ...options.where, user_id: { [Op.not]: userId } } });

    findWithPaginate(Poem, options)
        .then(poems => res.json(poems))
        .catch(e => next(e));
}

export default { list };
