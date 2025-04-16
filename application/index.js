const http = require('http');
const https = require('https');

// Function to get public IP address
const getPublicIP = () => {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data).ip));
    }).on('error', err => reject(err));
  });
};

// Create the server
const server = http.createServer(async (req, res) => {
  // Health check endpoint
  if (req.url === '/healthy') {
    res.writeHead(200); // Respond with HTTP 200 OK
    res.end('OK');      // Minimal content for ECS health check
    return;
  }

  // Time Format
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

  try {
    // Get public IP
    const ip = await getPublicIP();

    const responseData = {
      timestamp: timestamp,
      ip: ip
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(responseData, null, 2));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to get public IP' }));
  }
});

// Start the server on port 3001
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

