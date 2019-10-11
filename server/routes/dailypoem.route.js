import express from 'express';
import dailyCtrl from '../controllers/dailypoem.controller';
import { validateToken, auth } from '../helpers/auth';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/current')

    .get([validateToken, auth], dailyCtrl.getDailyTitle);

export default router;
