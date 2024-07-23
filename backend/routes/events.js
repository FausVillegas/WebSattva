import { Router } from 'express';
const router = Router();
import { getAllEvents, addEvent, deleteEvent } from '../controllers/events.js';
import upload from '../middleware/upload.js';
// import express from 'express';
// const router = express.Router();

router.get('/', getAllEvents);

router.post('/', upload('imageUrl'), addEvent);

// router.put('/:id', eventsController.updateEvent);

router.delete('/:id', deleteEvent);

export default router;

// export default router;
