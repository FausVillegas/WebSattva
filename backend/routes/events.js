import { Router } from 'express';
const router = Router();
import { getAllEvents, addEvent, deleteEvent, updateEvent, getEventById } from '../controllers/events.js';
import upload from '../middleware/upload.js';

router.get('/', getAllEvents);

router.get('/:id', getEventById);

// router.post('/', upload('imageUrl'), addEvent);
router.post('/', addEvent);

router.delete('/:id', deleteEvent);

// router.put('/:id', upload('imageUrl'), updateEvent);
router.put('/:id', updateEvent);

export default router;
