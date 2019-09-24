import express from 'express';
import userRoutes from './user.route';
import poemRoutes from './poem.route';
import authRoutes from './auth.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount user routes at /users
router.use('/users', userRoutes);

// mount poem routes at /poems
router.use('/poems', poemRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

export default router;
