const express = require('express');
const router = express.Router();
const classesController = require('../controllers/classes');
const upload = require('../middleware/upload');

// router.get('/', classesController.getAllClasses);
// router.post('/', classesController.createClass);
// router.put('/:id', classesController.updateClass);
// router.delete('/:id', classesController.deleteClass);

router.get('/', classesController.getAllClasses);

router.post('/', upload.single('imageUrl'), classesController.addClass);

// router.put('/:id', classesController.updateClass);

router.delete('/:id', classesController.deleteClass);

module.exports = router;
