// Nur für index.html – Wunsch absenden
function pruefeUndSenden() {
  const songname = document.getElementById("songname").value.trim();
  const kuenstler = document.getElementById("kuenstler").value.trim();
  const name = document.getElementById("name").value.trim();
  const meldung = document.getElementById("meldung");
  const letzteAbgabe = localStorage.getItem("letzteAbgabe");
  const jetzt = Date.now();

  if (letzteAbgabe && jetzt - letzteAbgabe < 5 * 60 * 1000) {
    const verbleibend = Math.ceil((5 * 60 * 1000 - (jetzt - letzteAbgabe)) / 1000);
    meldung.textContent = `Bitte warte noch ${verbleibend} Sekunden, bevor du erneut abgibst.`;
    meldung.style.color = "red";
    return;
  }

  if (songname === "" || kuenstler === "" || name === "") {
    meldung.textContent = "Bitte fülle alle Felder aus!";
    meldung.style.color = "red";
    return;
  }

  // Anfrage an das Backend senden
  fetch("/wunsch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ songname, kuenstler, name })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Fehler bei der Übertragung.");
      }
      return res.json();
    })
    .then(data => {
      meldung.textContent = "Vielen Dank! Dein Wunsch wurde erfolgreich abgegeben.";
      meldung.style.color = "green";

      // Zeit speichern & Felder leeren
      localStorage.setItem("letzteAbgabe", jetzt);
      document.getElementById("songname").value = "";
      document.getElementById("kuenstler").value = "";
      document.getElementById("name").value = "";
    })
    .catch(err => {
      meldung.textContent = "Fehler beim Senden deines Wunsches.";
      meldung.style.color = "red";
      console.error(err);
    });
}

  
  // Nur für wuensche.html – Wünsche anzeigen
  function ladeWuensche() {
    fetch("/wuensche")
      .then(res => res.json())
      .then(wuensche => {
        const tbody = document.querySelector("#wuenscheTabelle tbody");
        if (!tbody) return;
        tbody.innerHTML = "";
        wuensche.forEach(wunsch => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${wunsch.songname}</td>
            <td>${wunsch.kuenstler}</td>
            <td>${wunsch.name}</td>
          `;
          tbody.appendChild(row);
        });
      });
  }

  
// Ältesten Wunsch löschen
function loescheAeltesten() {
  fetch('/wuensche', {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        ladeWuensche(); // Tabelle neu laden
      } else {
        alert("Fehler beim Löschen.");
      }
    })
    .catch(error => {
      console.error("Fehler beim Löschen:", error);
    });
}
  
  // Wenn auf wuensche.html → beim Laden Daten holen
  if (window.location.pathname.endsWith("wuensche.html")) {
    window.onload = ladeWuensche;
  }

setInterval(ladeWuensche, 5000); // Alle 5 Sekunden neu laden
