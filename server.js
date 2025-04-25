const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Wunschliste im Arbeitsspeicher
let wuensche = [];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Für index.html und wuensche.html

// Songwunsch empfangen (POST)
app.post('/wunsch', (req, res) => {
  const { songname, kuenstler, name } = req.body;
  if (!songname || !kuenstler || !name) {
    return res.status(400).json({ error: 'Alle Felder sind erforderlich.' });
  }

  wuensche.push({ songname, kuenstler, name, zeit: Date.now() });
  res.status(200).json({ message: 'Wunsch erfolgreich gespeichert.' });
});

// Songwünsche abrufen (GET)
app.get('/wuensche', (req, res) => {
  res.json(wuensche);
});

// Ältesten Wunsch löschen (DELETE)
app.delete('/wuensche', (req, res) => {
  if (wuensche.length === 0) {
    return res.status(400).json({ error: 'Keine Wünsche vorhanden.' });
  }

  wuensche.shift(); // Ältesten Wunsch (am Anfang) entfernen
  res.status(200).json({ message: 'Ältester Wunsch gelöscht.' });
});

// Server starten
app.listen(PORT, () => {
  console.log(`🎧 Server läuft auf http://localhost:${PORT}`);
});
