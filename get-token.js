// Bu script bir kez çalıştırılır, refresh token alındıktan sonra silinebilir.
// Kullanım: node get-token.js <CLIENT_SECRET>

import { google } from 'googleapis';
import http from 'http';

const CLIENT_ID = '192107959353-4t60ceri1lap9atg8ov8o2t040252drv.apps.googleusercontent.com';
const CLIENT_SECRET = process.argv[2];
const REDIRECT = 'http://localhost:3005';

if (!CLIENT_SECRET) {
  console.error('Kullanım: node get-token.js <CLIENT_SECRET>');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/drive.file'],
  prompt: 'consent',
});

console.log('\n1. Şu URL\'yi tarayıcıda aç (erenköy hesabınla giriş yap):\n');
console.log(authUrl);
console.log('\n2. İzin verdikten sonra bu terminal\'e refresh token yazılacak.\n');

const server = http.createServer(async (req, res) => {
  const code = new URL(req.url, REDIRECT).searchParams.get('code');
  if (!code) { res.end('Bekleniyor...'); return; }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.end('<h2 style="font-family:sans-serif">✅ Token alındı! Bu sekmeyi kapatabilirsiniz.</h2>');
    console.log('\n✅ GOOGLE_REFRESH_TOKEN (bunu Railway\'e ekle):\n');
    console.log(tokens.refresh_token);
    console.log('\n');
    setTimeout(() => { server.close(); process.exit(0); }, 500);
  } catch (err) {
    res.end('Hata: ' + err.message);
    console.error(err);
  }
});

server.listen(3005, () => console.log('Localhost:3005 dinleniyor...\n'));
