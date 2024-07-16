const express = require('express');
const router = express.Router();
const instructorsController = require('../controllers/instructors');
const upload = require('../middleware/upload');

router.get('/', instructorsController.getAllInstructors);

router.post('/', instructorsController.addInstructor);

// router.put('/:id', instructorsController.upload);

router.delete('/:id', instructorsController.deleteInstructor);

module.exports = router;
