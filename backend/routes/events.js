import { Router } from 'express';
const router = Router();
import { getAllEvents, addEvent, deleteEvent, updateEvent, getEventById } from '../controllers/events.js';
import multer from 'multer';
const upload = multer();

router.get('/', getAllEvents);

router.get('/:id', getEventById);

router.post('/', upload.none(), addEvent);

router.delete('/:id', deleteEvent);

router.put('/:id', upload.none(), updateEvent);

export default router;
