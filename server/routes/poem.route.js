import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import poemCtrl from '../controllers/poem.controller';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/')

    /** GET /api/poems - Get list of poems */
    .get(poemCtrl.list)

    /** POST /api/poems - Create new poem */
    .post(validate(paramValidation.createPoem), poemCtrl.create);

router
    .route('/:poemId')

    /** GET /api/poems/:poemId - Get poem */
    .get(poemCtrl.get)

    /** PUT /api/poems/:poemId - Update poem */
    .put(validate(paramValidation.updatePoem), poemCtrl.update)

    /** DELETE /api/poems/:poemId - Delete poem */
    .delete(poemCtrl.remove);

/** Load poem when API with poemId route parameter is hit */
router.param('poemId', poemCtrl.load);

export default router;