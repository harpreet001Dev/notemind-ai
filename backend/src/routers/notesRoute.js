import express from 'express'
import {notes,createNote,updateNote,deleteNote} from '../controllers/notes.controller.js';
import authtenticateUser from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createNotesSchema, getNotesSchema } from '../validations/notes.validation.js';

const router =express.Router();

router.get('/get-notes',authtenticateUser, validate(getNotesSchema),notes)
router.post('/add-note',authtenticateUser,validate(createNotesSchema), createNote)
router.post('/update-note',authtenticateUser,validate(createNotesSchema), updateNote)
router.delete('/:noteId',authtenticateUser, deleteNote)

export default router;