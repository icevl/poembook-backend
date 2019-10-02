import Sequelize from 'sequelize';
import db from '../../config/sequelize';
import attributes from '../helpers/attributes';
import config from '../../config/config';

const Op = Sequelize.Op;

function getModel(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

async function findWithPaginate(model, options, cacheTable = '') {
    const page = options.page ? options.page : 1;
    const countingOptions = {};
    const findOptions = {
        ...options,
        limit: config.paginatorSize,
        offset: (page - 1) * config.paginatorSize
    };

    if (options.where) {
        countingOptions.where = options.where;
    }

    const total = await model.findAndCountAll(countingOptions);
    let response;

    if (!cacheTable) {
        response = await model.findAll(findOptions);
    } else {
        response = await model.cache(cacheTable).findAll(findOptions);
    }

    return {
        total: total.count,
        pages: Math.floor((total.count + (config.paginatorSize - 1)) / config.paginatorSize),
        results: response
    };
}

function poemsQuery(page, options) {
    const friendsList = options.friends ? options.friends : [];
    if (options.user_id) {
        friendsList.push(options.user_id);
    }

    return {
        attributes: attributes.poem,
        include: [
            {
                model: db.Comment,
                as: 'comments',
                limit: 3,
                attributes: attributes.comment,
                include: { model: db.User, as: 'user', attributes: attributes.user }
            },
            { model: db.User, as: 'user', attributes: attributes.user },
            {
                model: db.Like,
                as: 'likes',
                where: { user_id: { [Op.in]: friendsList } },
                attributes: ['user_id', 'user_login'],
                required: false
            }
        ],
        page,
        order: [['id', 'DESC']],
        where: options.where
    };
}

export default { findWithPaginate, getModel, poemsQuery };
