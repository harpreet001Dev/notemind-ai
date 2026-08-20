import express from 'express'
import validate from '../middlewares/validate.middleware.js';
import authtenticateUser from '../middlewares/auth.middleware.js';
import { userQuerySchema } from '../validations/rag.validation.js';
import { ask } from '../controllers/rag.controllers.js';
const router =express.Router();


router.post('/query',authtenticateUser,validate(userQuerySchema), ask)


export default router;