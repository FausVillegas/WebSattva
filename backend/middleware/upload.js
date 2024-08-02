import multer, { diskStorage } from 'multer';
import { extname as _extname } from 'path';

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + _extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(_extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

export default (fieldName) => upload.single(fieldName);

// // api/upload.js (Backend)
// import { put } from '@vercel/blob';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const file = req.files.file; // Usar un middleware para manejar archivos

//     if (!file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     try {
//       const { url } = await put('uploads', file, { access: 'public' });
//       res.status(200).json({ url });
//     } catch (error) {
//       res.status(500).json({ error: 'Error uploading file' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }
