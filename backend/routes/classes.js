import { Router } from 'express';
const router = Router();
import { getAllClasses, addClass, deleteClass, getClassById, updateClass } from '../controllers/classes.js';
import upload from '../middleware/upload.js';


// router.get('/', classesController.getAllClasses);
// router.post('/', classesController.createClass);
// router.put('/:id', classesController.updateClass);
// router.delete('/:id', classesController.deleteClass);

router.get('/', getAllClasses);

router.get('/:id', getClassById);

router.post('/', upload('imageUrl'), addClass);

router.delete('/:id', deleteClass);

router.put('/:id', updateClass);

export default router;

// const express = require('express');
// const router = express.Router();
// const classesController = require('../controllers/classes');
// const upload = require('../middleware/upload');


// // router.get('/', classesController.getAllClasses);
// // router.post('/', classesController.createClass);
// // router.put('/:id', classesController.updateClass);
// // router.delete('/:id', classesController.deleteClass);

// router.get('/', classesController.getAllClasses);

// router.post('/', upload.single('imageUrl'), classesController.addClass);

// // router.put('/:id', classesController.updateClass);

// router.delete('/:id', classesController.deleteClass);

// module.exports = router;