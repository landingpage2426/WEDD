


// import { Resend } from 'resend';
// import dotenv from 'dotenv';
// dotenv.config();

// const resend = new Resend(process.env.RESEND_API_KEY);


// // 🔍 Fonction pour géolocaliser une IP
// async function getLocationFromIP(ip) {
//   try {
//     const response = await fetch(`https://ipapi.co/${ip}/json/`);
//     const data = await response.json();
//     return {
//       city: data.city || 'Inconnue',
//       country: data.country_name || 'Inconnu',
//     };
//   } catch (error) {
//     console.error('[GEO] Erreur localisation IP :', error);
//     return { city: 'Inconnue', country: 'Inconnu' };
//   }
// }


// export async function sendLoginEmail(email) {
//   const now = new Date();
//   const dateLocale = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
//   const heureLocale = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
//   const { city, country } = await getLocationFromIP(ip);
//   try {
//     const { error } = await resend.emails.send({
//       from: 'WEDD SECURITE <wedd@resend.dev>',
//       to: email,
//       subject: 'Connexion détectée',
//       html: `
//        <p>Bonjour,</p>
//        <p>Nous souhaitons vous informer qu'une connexion à votre compte WEDD a été détectée le <strong>${dateLocale}</strong> à <strong>${heureLocale}</strong>.</p>
//        <p> Localisation estimée : <strong>${city}, ${country}</strong></p>
//        <p>Si ce n'était pas vous, nous vous recommandons de vérifier la sécurité de votre compte en changeant votre mot de passe.</p>
//       <p>Nous restons à votre disposition pour toute assistance.</p>
//        <p>Cordialement,<br />L'équipe WEDD</p>
//      `,
//     });

//     if (error) {
//       console.error('[MAIL] Erreur Resend :', error);
//     }
//   } catch (err) {
//     console.error('[MAIL] Exception :', err);
//   }
// }






import { Resend } from 'resend';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function getLocationFromIP(ip) {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    console.log("data",data);
    
    return {
      city: data.city || 'Inconnue',
      country: data.country_name || 'Inconnu',
    };
  } catch (error) {
    console.error('[GEO] Erreur localisation IP :', error);
    return { city: 'Inconnue', country: 'Inconnu' };
  }
}

export async function sendLoginEmail(email, ip) {
  const now = new Date();
  const dateLocale = now.toLocaleDateString('fr-FR');
  const heureLocale = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const { city, country } = await getLocationFromIP(ip);

  const { data, error } = await resend.emails.send({
    from: 'WEDD SECURITE <wedd@resend.dev>',
    to: email,
    subject: 'Connexion détectée à votre compte WEDD',
    html: `
      <p>Bonjour,</p>
      <p>Une connexion à votre compte WEDD a été détectée le <strong>${dateLocale}</strong> à <strong>${heureLocale}</strong>.</p>
      <p>📍 Localisation estimée : <strong>${city}, ${country}</strong></p>
      <p>Si ce n'était pas vous, changez votre mot de passe immédiatement.</p>
      <p>Cordialement,<br />L'équipe WEDD</p>
    `,
  });

  if (error) {
    console.error('[MAIL] Erreur Resend :', error);
  } else {
    console.log('[MAIL] Email envoyé via Resend API :', data.id);
  }
}
