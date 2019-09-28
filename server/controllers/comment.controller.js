import httpStatus from 'http-status';
import db from '../../config/sequelize';
import wrapper from '../helpers/response';
import attributes from '../helpers/attributes';

const Comment = db.Comment;
const Poem = db.Poem;

/**
 * Load comment and append to req.
 */
function load(req, res, next, id) {
    Comment.findById(id)
        .then(poem => {
            if (!poem) {
                const e = new Error('Poem does not exist');
                e.status = httpStatus.NOT_FOUND;
                return next(e);
            }
            req.poem = poem; // eslint-disable-line no-param-reassign
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
                // Poem.decrement('comments_count', { where: { id: req.body.id } });
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

    Comment.paginate(options)
        .then(comments => res.json(wrapper(comments)))
        .catch(e => next(e));
}

/**
 * Delete comment
 */
function remove(req, res, next) {
    const comment = req.comment;
    comment
        .destroy()
        .then(() => res.json({ success: true }))
        .catch(e => next(e));

    next();
}

export default { load, get, create, update, list, remove };
