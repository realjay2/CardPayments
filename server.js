// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const PAYMENTS_FILE = path.join(__dirname, 'payments.json');
const HTML_FILE = path.join(__dirname, 'index.html'); // Your HTML file name

app.use(express.json());
app.use(express.static(__dirname)); // Serve static files (HTML, CSS, JS)

// Serve your frontend HTML file on root
app.get('/', (req, res) => {
  res.sendFile(HTML_FILE);
});

// API endpoint to save payment data
app.post('/api/savePayment', (req, res) => {
  const paymentData = req.body;
  if (!paymentData) return res.status(400).json({ error: 'No payment data provided' });

  // Read existing payments
  let payments = [];
  try {
    if (fs.existsSync(PAYMENTS_FILE)) {
      const raw = fs.readFileSync(PAYMENTS_FILE, 'utf8');
      if (raw) payments = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading payments file:', err);
    return res.status(500).json({ error: 'Failed to read payments' });
  }

  // Append new payment
  payments.push(paymentData);

  // Write back to file
  try {
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2));
  } catch (err) {
    console.error('Error writing payments file:', err);
    return res.status(500).json({ error: 'Failed to save payment' });
  }

  res.json({ message: 'Payment saved successfully' });
});

// Optional: endpoint to get all payments (for admin)
app.get('/api/payments', (req, res) => {
  try {
    if (!fs.existsSync(PAYMENTS_FILE)) return res.json([]);
    const payments = JSON.parse(fs.readFileSync(PAYMENTS_FILE, 'utf8') || '[]');
    res.json(payments);
  } catch (err) {
    console.error('Error reading payments file:', err);
    res.status(500).json({ error: 'Failed to read payments' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
