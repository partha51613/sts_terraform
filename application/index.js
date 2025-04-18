const http = require('http');
const https = require('https');

// fallback function to get public IP via external service
function fetchPublicIP() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).ip);
        } catch (e) {
          reject('Failed to parse IP');
        }
      });
    }).on('error', err => reject(err));
  });
}

function getClientIPv4(req) {
  let ip =
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    '';

  if (ip.startsWith('::ffff:')) ip = ip.substring(7);

  return ip;
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/healthy') {
    res.writeHead(200);
    res.end('OK');
    return;
  }

  const now = new Date();
  const date = `${now.getDate().toString().padStart(2, '0')}/${
    (now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const time = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
  const timestamp = `${date} ${time}`;

  let ip = getClientIPv4(req);

  const isLocalOrPrivate =
    ip === '127.0.0.1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.');

  if (isLocalOrPrivate) {
    try {
      ip = await fetchPublicIP();
    } catch (e) {
      ip = 'Unknown';
    }
  }

  const responseData = {
    timestamp,
    ip
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(responseData, null, 2));
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
