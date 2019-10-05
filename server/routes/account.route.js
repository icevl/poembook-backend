import express from 'express';
import accountCtrl from '../controllers/account.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/').post(accountCtrl.create);

export default router;
