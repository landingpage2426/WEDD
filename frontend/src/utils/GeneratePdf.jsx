import jsPDF from 'jspdf';
import QRCode from 'qrcode';
  
  export const generatePdf = async (invite) => {
    const apiUrlFrontend = 'https://wedd-i8ls.onrender.com';
    const imageUrl = 'assets/img/billet.png';
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'A4',
    });

    const loadImageAsBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          resolve(dataUrl);
        };
        img.onerror = () => reject("❌ Erreur de chargement de l'image");
        img.src = url;
      });
    };

    try {
      const backgroundBase64 = await loadImageAsBase64(imageUrl);
      doc.addImage(backgroundBase64, 'PNG', 0, 0, 210, 297);
      const qrText = `${apiUrlFrontend}/invites/${invite.inviteId}`;
      const qrImage = await QRCode.toDataURL(qrText);
      doc.addImage(qrImage, 'PNG', 150, 205, 40, 40);

      let titreTexte = '';
      switch (invite.titre) {
        case 'M':
          titreTexte = `M. ${invite.prenom} ${invite.nom}`;
          break;
        case 'Mme':
          titreTexte = `Mme ${invite.prenom} ${invite.nom}`;
          break;
        case 'Mlle':
          titreTexte = `Mlle ${invite.prenom} ${invite.nom}`;
          break;
        case 'couple':
          titreTexte = `M. & Mme ${invite.nom}`;
          break;
        default:
          titreTexte = `${invite.prenom} ${invite.nom}`;
      }

      doc.setTextColor(208, 108, 56);
      doc.setFont('times', 'bold');
      doc.setFontSize(28);
      const textWidth =
        (doc.getStringUnitWidth(titreTexte) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const maxWidth = 110;

      if (textWidth > maxWidth) {
        doc.text(titreTexte, 30, 220, {
          maxWidth: maxWidth,
          align: 'left',
        });
      } else {
        doc.text(titreTexte, 30, 230);
      }
      doc.setFontSize(12);
      doc.text(`ID : ${invite.inviteId}`, 170, 250, null, null, 'center');

      return doc.output('blob');
    } catch (err) {
      console.error('Erreur génération PDF avec image :', err);
      return null;
    }
  };