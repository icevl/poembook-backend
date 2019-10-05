import express from 'express';
import userRoutes from './user.route';
import poemRoutes from './poem.route';
import subscriptionRoutes from './subscription.route';
import feedRoutes from './feed.route';
import commentRoutes from './comment.route';
import likeRoutes from './like.route';
import authRoutes from './auth.route';
import uploadRoutes from './upload.route';
import accountRoutes from './account.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount user routes at /users
router.use('/users', userRoutes);

// mount poem routes at /poems
router.use('/poems', poemRoutes);

// mount subscription routes at /subscriptions
router.use('/subscriptions', subscriptionRoutes);

// mount feed routes at /feed
router.use('/feed', feedRoutes);

// mount accoun routes at /accounts
router.use('/accounts', accountRoutes);

// mount upload routes at /uploads
router.use('/uploads', uploadRoutes);

// mount poem routes at /comments
router.use('/comments', commentRoutes);

// mount like routes at /likes
router.use('/likes', likeRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

export default router;
