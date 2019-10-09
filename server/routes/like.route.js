import express from 'express';
import likeCtrl from '../controllers/like.controller';
import { validateToken, auth } from '../helpers/auth';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/')

    /** GET /api/likes - Get list of likes */
    .get(validateToken, likeCtrl.list)

    /** POST /api/likes - like something */
    .post([validateToken, auth], likeCtrl.create);

router.route('/:type/:id').delete([validateToken, auth], likeCtrl.remove);

export default router;
