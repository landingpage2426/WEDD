import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { getBilletCivility, getBilletLineText, MAX_BILLET_LINE_CHARS } from './invitePeople';
import billetImg from '../assets/img/billet.jpg';

const IMG_W = 1024;
const IMG_H = 768;
const PAGE_W = 280;
const PAGE_H = 210;

const toMmX = (px) => (px / IMG_W) * PAGE_W;
const toMmY = (px) => (px / IMG_H) * PAGE_H;

const fitTextToWidth = (doc, text, maxWidth, maxFont = 11, minFont = 8) => {
  let size = maxFont;
  doc.setFontSize(size);
  let output = text;
  while (size > minFont && doc.getTextWidth(output) > maxWidth) {
    size -= 0.5;
    doc.setFontSize(size);
  }
  if (doc.getTextWidth(output) > maxWidth) {
    while (output.length > 1 && doc.getTextWidth(`${output}…`) > maxWidth) {
      output = output.slice(0, -1).trimEnd();
    }
    output = `${output}…`;
  }
  return output;
};

export const generatePdf = async (invite) => {
  const apiUrlFrontend = 'https://wedd-i8ls.onrender.com';

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
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.onerror = () => reject("❌ Erreur de chargement de l'image");
      img.src = url;
    });
  };

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [PAGE_W, PAGE_H],
  });

  try {
    const backgroundBase64 = await loadImageAsBase64(billetImg);
    doc.addImage(backgroundBase64, 'JPEG', 0, 0, PAGE_W, PAGE_H);

    doc.setFillColor(243, 232, 214);
    doc.rect(toMmX(138), toMmY(414), toMmX(128), toMmY(148), 'F');

    const qrText = `${apiUrlFrontend}/invites/${invite.inviteId}`;
    const qrImage = await QRCode.toDataURL(qrText, {
      margin: 1,
      width: 512,
      color: {
        dark: '#3b1d12',
        light: '#f3e8d6',
      },
    });

    const qrSize = toMmX(120);
    doc.addImage(qrImage, 'PNG', toMmX(142), toMmY(420), qrSize, qrSize);

    doc.setFillColor(229, 214, 201);
    doc.rect(toMmX(318), toMmY(342), toMmX(478), toMmY(18), 'F');

    doc.setFillColor(130, 95, 70);
    for (let x = 322; x <= 790; x += 7) {
      doc.circle(toMmX(x + 1.5), toMmY(355.5), toMmX(1.5), 'F');
    }

    doc.setTextColor(92, 51, 23);
    doc.setFont('times', 'italic');
    const civility = getBilletCivility(invite.titre);
    const rawName = getBilletLineText(invite.prenom, invite.nom, invite.titre);
    const nameOnLine = rawName.slice(0, MAX_BILLET_LINE_CHARS);
    const fullLine = [civility, nameOnLine].filter(Boolean).join(' ');

    if (fullLine) {
      const lineX = toMmX(322);
      const lineY = toMmY(351);
      const lineMaxWidth = toMmX(460);
      const fitted = fitTextToWidth(doc, fullLine, lineMaxWidth, 13, 8);
      doc.text(fitted, lineX, lineY);
    }

    return doc.output('blob');
  } catch (err) {
    console.error('Erreur génération PDF avec image :', err);
    return null;
  }
};
