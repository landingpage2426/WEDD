import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});


export async function sendLoginEmail(email) {
  const now = new Date();
  const dateLocale = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const heureLocale = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Notification de connexion à votre compte Arkevia',
    html: `
      <p>Bonjour,</p>
      <p>Nous vous informons qu'une connexion a eu lieu sur votre compte Arkevia le ${dateLocale} à ${heureLocale}.</p>
      <p>Cordialement,<br />L'équipe Arkevia</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log("email envoyé à " ,email );
  
}
