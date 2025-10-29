import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,        
  secure: false,    
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,  
  },
  tls: {
    rejectUnauthorized: false  
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
    subject: 'Notification de connexion à votre compte WEDD',
    html: `
  <p>Bonjour,</p>
<p>Nous souhaitons vous informer qu'une connexion à votre compte WEDD a été détectée le <strong>${dateLocale}</strong> à <strong>${heureLocale}</strong>.</p>
<p>Si ce n'était pas vous, nous vous recommandons de vérifier la sécurité de votre compte en changeant votre mot de passe.</p>
<p>Nous restons à votre disposition pour toute assistance.</p>
<p>Cordialement,<br />L'équipe WEDD</p>

    `,
  };
  console.log("email envoyé avec succès");
  
  await transporter.sendMail(mailOptions);
}
