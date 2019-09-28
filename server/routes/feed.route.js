import express from 'express';
import feedCtrl from '../controllers/feed.controller';
import { validateToken, auth } from '../helpers/auth';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/').get([validateToken, auth], feedCtrl.list);

export default router;
