import express from 'express';
import commentCtrl from '../controllers/comment.controller';
import { validateToken, auth } from '../helpers/auth';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/')

    /** GET /api/comments - Get list of comments */
    .get(validateToken, commentCtrl.list)

    /** POST /api/comments - Create new comment */
    .post([validateToken, auth], commentCtrl.create);

router
    .route('/:commentId')

    /** GET /api/comments/:commentId - Get comment */
    .get(commentCtrl.get)

    /** PUT /api/comments/:commentId - Update comment */
    .put(commentCtrl.update)

    /** DELETE /api/comments/:commentId - Delete comment */
    .delete([validateToken, auth], commentCtrl.remove);

/** Load comment when API with commentId route parameter is hit */
router.param('commentId', commentCtrl.load);

export default router;
