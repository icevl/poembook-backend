import httpStatus from 'http-status';
import db from '../../config/sequelize';
import attributes from '../helpers/attributes';
import config from '../../config/config';
import { findWithPaginate } from '../helpers/db';

const Poem = db.Poem;

/**
 * Load poem and append to req.
 */
function load(req, res, next, id) {
    Poem.findById(id)
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
 * Get poem
 */
function get(req, res) {
    return res.json(req.poem);
}

/**
 * Create new poem
 */
function create(req, res, next) {
    const poem = {
        content: req.body.content,
        user_id: req.user.id
    };

    Poem.create(poem)
        .then(savedPoem => res.json(savedPoem))
        .catch(e => next(e));
}

/**
 * Update existing poem
 */
function update(req, res, next) {
    const poem = req.poem;
    poem.content = req.body.content;

    poem.save()
        .then(savedPoem => res.json(savedPoem))
        .catch(e => next(e));
}

/**
 * Get poem list.
 *
 */
function list(req, res, next) {
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
        where: { user_id: req.user.id }
    };

    findWithPaginate(Poem, options)
        .then(poems => res.json(poems))
        .catch(e => next(e));
}

/**
 * Delete poem
 */
function remove(req, res, next) {
    const poem = req.poem;
    const content = req.poem.content;
    poem.destroy()
        .then(() => res.json(content))
        .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
