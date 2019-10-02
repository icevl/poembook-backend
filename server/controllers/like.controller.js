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

    const like = {
        object: req.body.type,
        object_id: req.body.id,
        user_id: req.user.id,
        user_login: req.user.login
    };

    const modelName = getModel(like.object);
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

    const modelResponse = await db[modelName].findOne({ where: { id: like.object_id } });
    if (!modelResponse) {
        const e = new Error('Not found');
        e.status = httpStatus.NOT_FOUND;
        return next(e);
    }

    Like.create(like)
        .then(savedLike => {
            db[modelName].increment('likes_count', { where: { id: req.body.id } });
            res.json(savedLike);
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
    const object = req.params.object;
    const objectId = req.params.objectId;

    const modelName = getModel(object);
    const response = await Like.findOne({ where: { object: object, object_id: objectId, user_id: req.user.id } });

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
                db[modelName].decrement('likes_count', { where: { id: objectId } });
            }

            return res.json({ success: true });
        })
        .catch(e => next(e));

    return true;
}

export default { get, create, update, list, remove };
