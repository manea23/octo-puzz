const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const SUBMISSIONS_FILE = path.join(__dirname, 'submissions.txt');

app.post('/submit', (req, res) => {
  const { wallet, size, moves } = req.body;
  if (!wallet) return res.status(400).send('Wallet is required');

  const entry = `${new Date().toISOString()} | Wallet: ${wallet} | Size: ${size} | Moves: ${moves}\n`;
  fs.appendFile(SUBMISSIONS_FILE, entry, err => {
    if (err) return res.status(500).send('Error saving submission');
    res.send('Submission saved');
  });
});

app.get('/leaderboard', (req, res) => {
  fs.readFile(SUBMISSIONS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading leaderboard');
    res.send(`<pre>${data}</pre>`);
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));


