import express from 'express';
import authRoute from './authRoute.js';
import notesRoute from './notesRoute.js';
import ragRoute from './rag.route.js';
const router = express.Router();

router.use('/auth', authRoute);
router.use('/notes',notesRoute);
router.use('/ask',ragRoute);
export default router;