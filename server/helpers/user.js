import db from '../../config/sequelize';

const Subscription = db.Subscription;

async function getFriendList(userId) {
    // const response = await Subscription.cache('subscriptions').findAll({
    const response = await Subscription.findAll({
        where: { subscriber_id: userId },
        attributes: ['user_id']
    });

    const list = response.map(item => item.user_id);
    list.push(userId);
    return list;
}

export default { getFriendList };
