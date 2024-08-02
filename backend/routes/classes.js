import { Router } from 'express';
const router = Router();
import { getAllClasses, addClass, deleteClass, getClassById, updateClass } from '../controllers/classes.js';
import multer from 'multer';
const upload = multer();

router.get('/', getAllClasses);

router.get('/:id', getClassById);

router.post('/', upload.none(), addClass);

router.delete('/:id', deleteClass);

router.put('/:id', upload.none(), updateClass);

export default router;