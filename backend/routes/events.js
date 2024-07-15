const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events');
const upload = require('../middleware/upload');

router.get('/', eventsController.getAllEvents);

router.post('/', upload.single('imageUrl'), eventsController.addEvent);

// router.put('/:id', eventsController.updateEvent);

router.delete('/:id', eventsController.deleteEvent);

module.exports = router;
