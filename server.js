const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

const DATEIPFAD = path.join(__dirname, "wuensche.json");

app.use(express.json());
app.use(require("cors")());
app.use(express.static("public")); // Deine HTML-Dateien

// Hilfsfunktion: Wünsche laden
function ladeWuensche() {
    if (!fs.existsSync(DATEIPFAD)) return [];
    return JSON.parse(fs.readFileSync(DATEIPFAD));
}

// Hilfsfunktion: Wünsche speichern
function speichereWuensche(wuensche) {
    fs.writeFileSync(DATEIPFAD, JSON.stringify(wuensche, null, 2));
}

// 📨 POST /wunsch – Neuen Wunsch speichern
app.post("/wunsch", (req, res) => {
    const { songname, kuenstler, name } = req.body;
    if (!songname || !kuenstler || !name) {
        return res.status(400).json({ fehler: "Alle Felder sind erforderlich" });
    }

    const wuensche = ladeWuensche();
    wuensche.push({ songname, kuenstler, name, zeitstempel: Date.now() });
    speichereWuensche(wuensche);

    res.json({ erfolg: true });
});

// 📋 GET /wuensche – Alle Wünsche abrufen
app.get("/wuensche", (req, res) => {
    const wuensche = ladeWuensche();
    res.json(wuensche);
});

// ❌ DELETE /wunsch/ältester – Ältesten Wunsch löschen
app.delete("/wunsch/ältester", (req, res) => {
    const wuensche = ladeWuensche();
    if (wuensche.length === 0) return res.status(404).json({ fehler: "Keine Wünsche vorhanden" });

    wuensche.sort((a, b) => a.zeitstempel - b.zeitstempel);
    wuensche.shift();
    speichereWuensche(wuensche);

    res.json({ erfolg: true });
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft unter http://localhost:${PORT}`);
});
