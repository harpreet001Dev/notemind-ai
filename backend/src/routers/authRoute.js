import express from 'express';
import { register, login,refresh } from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { registerSchema } from '../validations/auth.validation.js';
import authtenticateUser from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register',  validate(registerSchema), register);
router.post('/login', validate(registerSchema), login);
router.post('/refresh', refresh);

export default router;


