import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import  nodemailer from "nodemailer";
import  multer from 'multer';
import  fs from 'fs';
const router = express.Router();
// Transporteur NodeMailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});
const uploadPDF = multer({ dest: "uploadPDF/" }); // dossier temporaire

// Endpoint pour recevoir le PDF et envoyer l'email
router.post("/", uploadPDF.single("pdf"), async (req, res) => {
    
  try {
    const { email, subject, text } = req.body;
    const pdfFile = req.file;

    if (!email || !pdfFile) {
      return res.status(400).json({ message: "Email et PDF requis" });
    }

    // Envoyer l'email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject || "Invitation",
      text: text || "Veuillez trouver votre invitation ci-joint.",
      attachments: [
        {
          filename: pdfFile.originalname,
          path: pdfFile.path,
        },
      ],
    });

    // Supprimer le PDF temporaire
    fs.unlinkSync(pdfFile.path);

    res.json({ message: "Email envoyé avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email", error: err });
  }
});


export default router;


