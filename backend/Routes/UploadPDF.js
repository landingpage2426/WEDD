const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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




module.exports = router;
