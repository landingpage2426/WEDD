// const express = require('express');
// require('dotenv').config();
// // route d'envoi d'email
// const nodemailer = require("nodemailer");
// const multer = require('multer');
// const fs = require('fs');
// const router = express.Router();
// // Transporteur NodeMailer
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "bertinkuicheu@gmail.com",
//     pass: "srrzryqofhcqcguo",
//   },
// });
// const uploadPDF = multer({ dest: "uploadPDF/" }); // dossier temporaire

// // Endpoint pour recevoir le PDF et envoyer l'email
// router.post("/", uploadPDF.single("pdf"), async (req, res) => {
    
//   try {
//     const { email, subject, text } = req.body;
//     const pdfFile = req.file;

//     if (!email || !pdfFile) {
//       return res.status(400).json({ message: "Email et PDF requis" });
//     }

//     // Envoyer l'email
//     await transporter.sendMail({
//       from: "smartroom.alarm@gmail.com",
//       to: email,
//       subject: subject || "Invitation",
//       text: text || "Veuillez trouver votre invitation ci-joint.",
//       attachments: [
//         {
//           filename: pdfFile.originalname,
//           path: pdfFile.path,
//         },
//       ],
//     });

//     // Supprimer le PDF temporaire
//     fs.unlinkSync(pdfFile.path);

//     res.json({ message: "Email envoyé avec succès !" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Erreur lors de l'envoi de l'email", error: err });
//   }
// });


// module.exports = router;
// const express = require('express');
// require('dotenv').config();
// const nodemailer = require("nodemailer");
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const { Storage } = require('megajs');
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Storage } from 'megajs';


const router = express.Router();

// === 1️⃣ Config du transporteur NodeMailer ===
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// === 2️⃣ Config Multer (upload temporaire local) ===
const upload = multer({ dest: "uploadPDF/" });

// === 3️⃣ Route principale ===
router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    const { email, subject, text } = req.body;
    const pdfFile = req.file;

    if (!email || !pdfFile) {
      return res.status(400).json({ message: "Email et PDF requis" });
    }

    // === 4️⃣ Connexion à MEGA ===
    const storage = new Storage({
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD,
    });

    await new Promise((resolve, reject) => {
      storage.on('ready', resolve);
      storage.on('error', reject);
    });

    // === 5️⃣ Upload du PDF sur MEGA ===
    const fileStream = fs.createReadStream(pdfFile.path);
    const uploadedFile = await new Promise((resolve, reject) => {
      const upload = storage.upload(pdfFile.originalname, fileStream);
      upload.on('complete', resolve);
      upload.on('error', reject);
    });

    // === 6️⃣ Générer le lien de téléchargement MEGA ===
    const downloadLink = uploadedFile.link();

    // === 7️⃣ Préparer et envoyer l’email ===
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject || "Votre document PDF",
      html: `
        <p>${text || "Veuillez trouver votre fichier PDF ci-joint."}</p>
        <p>Téléchargement direct :</p>
        <a href="${downloadLink}">${downloadLink}</a>
      `,
      attachments: [
        {
          filename: pdfFile.originalname,
          path: pdfFile.path,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    // === 8️⃣ Nettoyer le fichier local ===
    fs.unlinkSync(pdfFile.path);

    res.json({
      message: "Email envoyé avec succès et fichier uploadé sur MEGA !",
      downloadLink,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email", error: err.message });
  }
});

export default router;
