import { Router } from 'express';
const router = Router();
import { getAllInstructors, addInstructor, deleteInstructor, updateInstructor } from '../controllers/instructors.js';

// import express from 'express';
// const router = express.Router();

router.get('/', getAllInstructors);

router.post('/', addInstructor);

router.put('/', updateInstructor);

router.delete('/:id', deleteInstructor);

export default router;
// export default router;
