import httpStatus from 'http-status';
import db from '../../config/sequelize';
import { findWithPaginate } from '../helpers/db';
import attributes from '../helpers/attributes';

const Comment = db.Comment;
const Poem = db.Poem;

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

            const modelName = comment.commentable.charAt(0).toUpperCase() + comment.commentable.slice(1);
            const response = await db[modelName].findOne({ id: comment.commentable_id });

            req.comment = comment;
            req.target = response;
            req.model = modelName;

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
function create(req, res, next) {
    const comment = {
        content: req.body.content,
        commentable: req.body.type,
        commentable_id: req.body.id,
        user_id: req.user.id
    };

    Comment.create(comment)
        .then(savedComment => {
            if (req.body.type === 'poem') {
                Poem.increment('comments_count', { where: { id: req.body.id } });
            }

            res.json(savedComment);
        })
        .catch(e => next(e));
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
        attributes: attributes.comment,
        include: [{ model: db.User, as: 'user', attributes: attributes.user }],
        paginate: 20,
        page,
        order: [['id', 'DESC']],
        where: { commentable_id: id, commentable: type }
    };

    findWithPaginate(Comment, options)
        .then(comments => res.json(comments))
        .catch(e => next(e));
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
            db[req.model].decrement('comments_count', { where: { id: comment.commentable_id } });
            return res.json({ success: true });
        })
        .catch(e => next(e));

    return true;
}

export default { load, get, create, update, list, remove };
