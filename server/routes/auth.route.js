import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import { validateToken, auth } from '../helpers/auth';
import paramValidation from '../../config/param-validation';
import authCtrl from '../controllers/auth.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/').get([validateToken, auth], authCtrl.auth);

/**
 * POST /api/auth/login - Returns token if correct username and password is provided
 */
router.route('/login').post(validate(paramValidation.login), authCtrl.login);
router.route('/fblogin').post(authCtrl.facebookLogin);
router.route('/get').post([validateToken, auth], authCtrl.getUser);

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header.
 * Authorization: Bearer {token}
 */
router.route('/random-number').get(
    expressJwt({
        secret: config.jwtSecret
    }),
    authCtrl.getRandomNumber
);

export default router;
