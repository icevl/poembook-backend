import express from 'express';
import userRoutes from './user.route';
import poemRoutes from './poem.route';
import subscriptionRoutes from './subscription.route';
import feedRoutes from './feed.route';
import commentRoutes from './comment.route';
import authRoutes from './auth.route';
import uploadRoutes from './upload.route';

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

// mount upload routes at /uploads
router.use('/uploads', uploadRoutes);

// mount poem routes at /comments
router.use('/comments', commentRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

export default router;
