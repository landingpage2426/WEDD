import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { getBilletCivility, getBilletLineText, MAX_BILLET_LINE_CHARS } from './invitePeople';
import billetImg from '../assets/img/billet.jpg';

const SRC_W = 1446;
const SRC_H = 1087;
const PAGE_W = 280;
const PAGE_H = 210;
const API_URL_FRONTEND = 'https://wedd-i8ls.onrender.com';
const PAPER = 'rgb(247, 226, 208)';
const INK = 'rgb(92, 51, 23)';

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
        color: { dark: '#3b1d12', light: '#f7e2d0' },
      })
    ),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = background.naturalWidth || SRC_W;
  canvas.height = background.naturalHeight || SRC_H;
  const ctx = canvas.getContext('2d');
  const sx = canvas.width / SRC_W;
  const sy = canvas.height / SRC_H;
  const X = (value) => value * sx;
  const Y = (value) => value * sy;

  ctx.drawImage(background, 0, 0);

  ctx.fillStyle = PAPER;
  ctx.fillRect(X(196), Y(455), X(192), Y(330));

  const cardCenter = X(292);
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${Math.round(16 * sy)}px "Times New Roman", Times, serif`;
  ctx.fillText('SCANNEZ ICI', cardCenter, Y(488));

  const inviteIdText = String(invite.inviteId || '').trim();
  if (inviteIdText) {
    ctx.font = `bold ${Math.round(15 * sy)}px "Times New Roman", Times, serif`;
    ctx.fillText(inviteIdText, cardCenter, Y(512));
  }

  const qrSize = X(180);
  ctx.drawImage(qrImage, cardCenter - qrSize / 2, Y(536), qrSize, qrSize);

  ctx.fillStyle = PAPER;
  ctx.fillRect(X(398), Y(456), X(248), Y(42));
  ctx.fillStyle = 'rgb(55, 28, 16)';
  for (let dot = 412; dot <= 640; dot += 8) {
    ctx.beginPath();
    ctx.arc(X(dot), Y(490), Math.max(1.2, 1.5 * sx), 0, Math.PI * 2);
    ctx.fill();
  }

  const civility = getBilletCivility(invite.titre);
  const rawName = getBilletLineText(invite.prenom, invite.nom, invite.titre);
  const nameOnLine = rawName.slice(0, MAX_BILLET_LINE_CHARS);
  const fullLine = [civility, nameOnLine].filter(Boolean).join(' ');

  if (fullLine) {
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const fitted = fitCanvasText(ctx, fullLine, X(690), Math.round(26 * sy), Math.round(16 * sy));
    ctx.fillText(fitted, X(414), Y(485));
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
