import httpStatus from 'http-status';
import db from '../../config/sequelize';
import { findWithPaginate, getModel } from '../helpers/db';
import attributes from '../helpers/attributes';
import objects from '../helpers/objects';
import { checkUser } from '../helpers/auth';

const Like = db.Like;

/**
 * Get like
 */
function get(req, res) {
    return res.json(req.like);
}

/**
 * Post like
 */
async function create(req, res, next) {
    checkUser(req, res, next);

    const id = Number(req.body.id);
    const type = req.body.type;
    const targetKey = `${type}_id`;

    const like = {
        user_id: req.user.id,
        user_login: req.user.login,
        [targetKey]: id
    };

    const modelName = getModel(type);
    if (objects.can_like.indexOf(modelName) === -1) {
        const e = new Error('Not found');
        e.status = httpStatus.NOT_FOUND;
        return next(e);
    }

    const response = await Like.findOne({ where: like });
    if (response) {
        const e = new Error('Like exists');
        e.status = httpStatus.NOT_FOUND;
        return next(e);
    }

    const modelResponse = await db[modelName].findOne({ where: { id: like[targetKey] } });
    if (!modelResponse) {
        const e = new Error('Not found');
        e.status = httpStatus.NOT_FOUND;
        return next(e);
    }

    Like.create(like)
        .then(savedLike => {
            db[modelName].increment('likes_count', { where: { id: id } });
            return res.json(savedLike);
        })
        .catch(e => next(e));

    return true;
}

/**
 * Update existing comment
 */
function update(req, res, next) {
    next();
}

/**
 * Get comments list.
 *
 */
function list(req, res, next) {
    const { page = 1, type, id } = req.query;
    const options = {
        attributes: attributes.like,
        include: [{ model: db.User, as: 'user', attributes: attributes.user }],
        paginate: 20,
        page,
        order: [['id', 'DESC']],
        where: { object_id: id, object: type }
    };

    findWithPaginate(Like, options)
        .then(comments => res.json(comments))
        .catch(e => next(e));
}

/**
 * Unlike
 */
async function remove(req, res, next) {
    checkUser(req, res, next);

    const id = Number(req.params.id);
    const type = req.params.type;
    const targetKey = `${type}_id`;

    const modelName = getModel(type);
    const response = await Like.findOne({ where: { [targetKey]: id, user_id: req.user.id } });

    if (!response) {
        return res.status(404).json({ error: 'No like found' });
    }

    Like.destroy({
        where: {
            id: response.id
        }
    })
        .then(() => {
            if (objects.can_like.indexOf(modelName) > -1) {
                db[modelName].decrement('likes_count', { where: { id: id } });
            }

            return res.json({ success: true });
        })
        .catch(e => next(e));

    return true;
}

export default { get, create, update, list, remove };
