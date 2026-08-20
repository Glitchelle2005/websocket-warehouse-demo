const WebSocket = require('ws');
const axios = require('axios'); // for making HTTP requests

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server is running on ws://localhost:8080');

// Local cache for warehouse stock
let cachedStock = null;

// Function to poll the warehouse API
async function pollWarehouse() {
  try {
    const response = await axios.get('http://localhost:5000/warehouse/stock');
    cachedStock = response.data; // update cache

    console.log('Polled warehouse:', cachedStock);

    // Broadcast the latest stock data to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Updated stock: ${JSON.stringify(cachedStock)}`);
      }
    });
  } catch (error) {
    console.error('Error polling warehouse:', error.message);
  }
}

// Run immediately, then every 5 minutes
pollWarehouse();
setInterval(pollWarehouse, 300000);

// Connection event handler
wss.on('connection', (ws) => {
  console.log('New client connected');
  ws.send('Welcome to the WebSocket server!');

  // Immediately send cached stock if available
  if (cachedStock) {
    ws.send(`Current stock: ${JSON.stringify(cachedStock)}`);
  }

  // Handle client messages
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);

    if (message === 'getStock') {
      // ✅ Send the cached stock back to the client
      ws.send(`Current stock: ${JSON.stringify(cachedStock)}`);
    } else {
      // Broadcast chat messages to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`Server received: ${message}`);
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
