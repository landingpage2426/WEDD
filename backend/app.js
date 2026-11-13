import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import routes from './Routes/Routes.js';
import uploadRoutes from './Routes/UploadPDF.js';
import uploadPdfMail from './Routes/UploadPdfMail.js';
import { swaggerSpec } from './config/swagger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  'https://wedd-i8ls.onrender.com',
  'https://wedd-2.onrender.com',
  'http://localhost:5173',
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS bloqué pour l'origine :", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (_req, res) => {
  res.json(swaggerSpec);
});

app.use('/api', routes);
app.use('/uploads', express.static('uploads'));
app.use('/uploadPDF', express.static(path.join(__dirname, 'uploadPDF')));
app.use('/api/uploadPDF', uploadRoutes);
app.use('/api/send-email', uploadPdfMail);

export default app;
