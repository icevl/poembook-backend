import express from 'express';
// import validate from 'express-validation';
// import paramValidation from '../../config/param-validation';
import uploadCtrl from '../controllers/upload.controller';
import { validateToken, auth } from '../helpers/auth';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/')

    /** POST /api/uploads - Create new upload */
    .post([validateToken, auth], uploadCtrl.create);

router
    .route('/:uploadId')

    /** DELETE /api/uploads/:uploadId - Delete user */
    .delete(uploadCtrl.remove);

export default router;
