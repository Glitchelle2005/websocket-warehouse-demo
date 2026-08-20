const express = require('express');
const app = express();
const PORT = 5000;

// Sample warehouse data
let warehouseStock = [
  { item: 'Laptop', quantity: 42 },
  { item: 'Mouse', quantity: 120 },
  { item: 'Keyboard', quantity: 75 },
];

// 🔁 Simulate stock changes every minute
setInterval(() => {
  warehouseStock.forEach(product => {
    product.quantity = Math.floor(Math.random() * 100);
  });
  console.log('Stock updated:', warehouseStock);
}, 60000); // update every minute

// Endpoint to get stock
app.get('/warehouse/stock', (req, res) => {
  res.json(warehouseStock);
});

app.listen(PORT, () => {
  console.log(`Mock warehouse API running at http://localhost:${PORT}`);
});
