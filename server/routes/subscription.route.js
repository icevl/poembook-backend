import express from 'express';
import subscriptionCtrl from '../controllers/subscription.controller';
import { validateToken, auth } from '../helpers/auth';

const router = express.Router(); // eslint-disable-line new-cap

router
    .route('/')

    /** GET /api/subscriptions - Get list of subscriptions */
    .get(subscriptionCtrl.list)

    /** POST /api/subscriptions - Create new subscription */
    .post([validateToken, auth], subscriptionCtrl.create);

router
    .route('/:userId')

    /** GET /api/subscriptions/:subscriptionId - Get subscription */
    .get(subscriptionCtrl.get)

    /** DELETE /api/subscriptions/:subscriptionId - Delete subscription */
    .delete([validateToken, auth], subscriptionCtrl.remove);

export default router;
