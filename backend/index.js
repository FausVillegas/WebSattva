import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';

import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import classesRoutes from './routes/classes.js';
import eventsRoutes from './routes/events.js';
import instructorsRoutes from './routes/instructors.js';
import paymentRoutes from './routes/payment.js';
import cartRoutes from './routes/cart.js';
import * as errorController from './controllers/error.js';
import db from './util/database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para manejar la carga de archivos
app.post('/api/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    try {
      const { url } = await put(file.originalname, file.buffer, {
        access: 'public',
        token: process.env.VERCEL_BLOB_WRITE_TOKEN,
      });
  
      res.status(200).json({ url });
    } catch (error) {
      console.error('Error uploading file', error);
      res.status(500).json({ error: 'Error uploading file' });
    }
  });

// Configuración de CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Otros middlewares
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));

// Rutas
app.get("/", (req, res) => {
    res.send("backend server open");
});

app.get('/test-db', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT 1 + 1 AS result'); // Simple query
      res.json({ message: 'Database connection successful!', result: rows[0].result });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Error connecting to database' });
    }
  });

app.use('/uploads', express.static('uploads'));
app.use('/auth', authRoutes);
app.use('/products', productsRoutes);
app.use('/classes', classesRoutes);
app.use('/events', eventsRoutes);
app.use('/instructors', instructorsRoutes);
app.use('/payment', paymentRoutes);
app.use('/cart', cartRoutes);

app.get('/is-enrolled', async (req, res) => {
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

// Manejo de errores
app.use(errorController.get404);
app.use(errorController.get500);

app.listen(port, () => console.log(`Listening on port ${port}`));
