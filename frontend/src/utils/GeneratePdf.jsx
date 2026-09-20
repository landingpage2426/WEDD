import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { getBilletCivility, getBilletLineText, MAX_BILLET_LINE_CHARS } from './invitePeople';
import billetImg from '../assets/img/billet.jpg';

const IMG_W = 1024;
const IMG_H = 768;
const PAGE_W = 280;
const PAGE_H = 210;
const API_URL_FRONTEND = 'https://wedd-i8ls.onrender.com';

const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Erreur de chargement de l'image"));
    img.src = url;
  });

const fitCanvasText = (ctx, text, maxWidth, maxFont = 17, minFont = 11) => {
  let size = maxFont;
  let output = text;
  ctx.font = `italic ${size}px "Times New Roman", Times, serif`;
  while (size > minFont && ctx.measureText(output).width > maxWidth) {
    size -= 0.5;
    ctx.font = `italic ${size}px "Times New Roman", Times, serif`;
  }
  if (ctx.measureText(output).width > maxWidth) {
    while (output.length > 1 && ctx.measureText(`${output}…`).width > maxWidth) {
      output = output.slice(0, -1).trimEnd();
    }
    output = `${output}…`;
  }
  return output;
};

const drawBilletCanvas = async (invite) => {
  const [background, qrImage] = await Promise.all([
    loadImage(billetImg),
    loadImage(
      await QRCode.toDataURL(`${API_URL_FRONTEND}/invites/${invite.inviteId}`, {
        margin: 1,
        width: 512,
        color: { dark: '#3b1d12', light: '#f3e8d6' },
      })
    ),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = IMG_W;
  canvas.height = IMG_H;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(background, 0, 0, IMG_W, IMG_H);

  ctx.fillStyle = 'rgb(243, 232, 214)';
  ctx.fillRect(138, 414, 128, 148);
  ctx.drawImage(qrImage, 142, 420, 120, 120);

  ctx.fillStyle = 'rgb(229, 214, 201)';
  ctx.fillRect(318, 342, 478, 18);

  ctx.fillStyle = 'rgb(130, 95, 70)';
  for (let x = 322; x <= 790; x += 7) {
    ctx.beginPath();
    ctx.arc(x + 1.5, 355.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const civility = getBilletCivility(invite.titre);
  const rawName = getBilletLineText(invite.prenom, invite.nom, invite.titre);
  const nameOnLine = rawName.slice(0, MAX_BILLET_LINE_CHARS);
  const fullLine = [civility, nameOnLine].filter(Boolean).join(' ');

  if (fullLine) {
    ctx.fillStyle = 'rgb(92, 51, 23)';
    ctx.textBaseline = 'alphabetic';
    const fitted = fitCanvasText(ctx, fullLine, 460);
    ctx.fillText(fitted, 322, 351);
  }

  return canvas;
};

export const generateBilletPreviewUrl = async (invite) => {
  try {
    const canvas = await drawBilletCanvas(invite);
    return canvas.toDataURL('image/jpeg', 0.92);
  } catch (err) {
    console.error('Erreur aperçu billet :', err);
    return null;
  }
};

export const generatePdf = async (invite) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [PAGE_W, PAGE_H],
  });

  try {
    const canvas = await drawBilletCanvas(invite);
    doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, PAGE_W, PAGE_H);
    return doc.output('blob');
  } catch (err) {
    console.error('Erreur génération PDF avec image :', err);
    return null;
  }
};
