import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
    const { userId, classEventId, activityType } = req.query;
    try {
        let isEnrolled = false;
        if (activityType === 'event') {
            isEnrolled = await SattvaEvent.isUserEnrolled(classEventId, userId);
        } else {
            isEnrolled = await SattvaClass.isUserEnrolled(classEventId, userId);
        }
        if (isEnrolled)
            res.json('Ya estás inscrito en esta actividad.');
        else
            res.json('');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al verificar la inscripción' });
    }
});

export default router;
