import Sequelize from 'sequelize';
import httpStatus from 'http-status';
import db from '../../config/sequelize';
import { findWithPaginate, getModel } from '../helpers/db';
import attributes from '../helpers/attributes';
import objects from '../helpers/objects';
import { checkUser } from '../helpers/auth';
import { getFriendList } from '../helpers/user';

const Comment = db.Comment;
const Op = Sequelize.Op;

/**
 * Load comment and append to req.
 */
function load(req, res, next, id) {
    Comment.findOne({ where: { id } })
        .then(async comment => {
            if (!comment) {
                const e = new Error('Comment does not exist');
                e.status = httpStatus.NOT_FOUND;
                return next(e);
            }

            let modelName = '';
            let modelField = '';

            if (comment.poem_id) {
                modelName = 'Poem';
                modelField = 'poem_id';
            }

            const response = await db[modelName].findOne({ id: comment[modelField] });

            req.comment = comment;
            req.target = response;
            req.model = modelName;
            req.field = modelField;

            return next();
        })
        .catch(e => next(e));
}

/**
 * Get comment
 */
function get(req, res) {
    return res.json(req.poem);
}

/**
 * Create new comment
 */
async function create(req, res, next) {
    checkUser(req, res, next);

    const type = req.body.type;
    const id = Number(req.body.id);
    const targetKey = `${type}_id`;

    const modelName = getModel(type);
    if (objects.can_comment.indexOf(modelName) === -1) {
        const e = new Error('Not found');
        e.status = httpStatus.NOT_FOUND;
        return next(e);
    }

    const comment = {
        content: req.body.content,
        user_id: req.user.id,
        [targetKey]: id
    };

    const modelResponse = await db[modelName].findOne({ where: { id: id } });
    if (!modelResponse) {
        const e = new Error('Not found');
        e.status = httpStatus.NOT_FOUND;
        return next(e);
    }

    Comment.create(comment)
        .then(savedComment => {
            db[modelName].increment('comments_count', { where: { id: id } });
            return res.json(savedComment);
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
async function list(req, res, next) {
    let userId = 0;

    if (req.user) {
        userId = req.user.id;
    }

    const { page = 1, type, id } = req.query;

    const modelName = getModel(type);
    const friendList = await getFriendList(userId);

    if (objects.can_comment.indexOf(modelName) === -1) {
        const e = new Error('Not found');
        e.status = httpStatus.NOT_FOUND;
        return next(e);
    }

    const options = {
        attributes: attributes.comment,
        include: [
            { model: db.User, as: 'user', attributes: attributes.user },
            {
                model: db.Like,
                as: 'likes',
                where: { user_id: { [Op.in]: friendList } },
                attributes: ['user_id', 'user_login'],
                required: false
            }
        ],
        paginate: 10,
        page,
        order: [['id', 'ASC']],
        where: { [`${type}_id`]: id }
    };

    findWithPaginate(Comment, options)
        .then(comments => res.json(comments))
        .catch(e => next(e));

    return true;
}

/**
 * Delete comment
 */
function remove(req, res, next) {
    const comment = req.comment;
    const target = req.target;

    if (req.user.id !== comment.user_id && req.user.id !== target.user_id) {
        const e = new Error('Restricted');
        e.status = httpStatus.FORBIDDEN;
        return next(e);
    }

    comment
        .destroy()
        .then(() => {
            db[req.model].decrement('comments_count', { where: { id: comment[req.field] } });
            return res.json({ success: true });
        })
        .catch(e => next(e));

    return true;
}

export default { load, get, create, update, list, remove };
