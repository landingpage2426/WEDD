// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// const router = express.Router();

// // Créer automatiquement le dossier uploadPDF s'il n'existe pas
// const uploadDir = path.join(__dirname, '..', 'uploadPDF');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Configurer le stockage Multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir); // nouveau chemin
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   }
// });

// const upload = multer({ storage });

// router.post('/', upload.single('file'), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' });

//   const fileUrl = `${req.protocol}://${req.get('host')}/uploadPDF/${req.file.filename}`;
//   res.status(200).json({ url: fileUrl });
// });




// export default router;


import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Obtenir __filename et __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Créer automatiquement le dossier uploadPDF s'il n'existe pas
const uploadDir = path.join(__dirname, '..', 'uploadPDF');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configurer le stockage Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // nouveau chemin
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' });

  const fileUrl = `${req.protocol}://${req.get('host')}/uploadPDF/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
});

export default router;
