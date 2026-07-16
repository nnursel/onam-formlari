import express from 'express';
import { google } from 'googleapis';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 30 * 1024 * 1024 } });

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost'
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Dosya bulunamadı' });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const stream = Readable.from(req.file.buffer);

    await drive.files.create({
      requestBody: {
        name: req.file.originalname,
        parents: FOLDER_ID ? [FOLDER_ID] : [],
        mimeType: 'application/pdf',
      },
      media: { mimeType: 'application/pdf', body: stream },
      fields: 'id',
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Drive upload error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
