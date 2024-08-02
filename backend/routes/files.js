import { Router } from 'express';
import multer from 'multer';
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import { put } from '@vercel/blob';

router.post('/', upload.single('file'), async (req, res) => {
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

export default router;
