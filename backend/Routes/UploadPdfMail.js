const express = require('express');
// route d'envoi d'email
const nodemailer = require("nodemailer");
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
// Transporteur NodeMailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bertinkuicheu@gmail.com",
    pass: "srrzryqofhcqcguo",
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
      from: "smartroom.alarm@gmail.com",
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


module.exports = router;