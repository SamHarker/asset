
async function loadData() {
  try {
    const response = await fetch("postazioni.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const tbody = document.querySelector("#postazioni tbody");
    if (!tbody) throw new Error("Manca #postazioni tbody nell'HTML");
    tbody.innerHTML = "";

    data.forEach(item => {
      const row = tbody.insertRow();
      row.innerHTML = `
        <td contenteditable="true">${item.stanza ?? ""}</td>
        <td contenteditable="true">${item.scrivania ?? ""}</td>
        <td contenteditable="true">${item.workstation ?? ""}</td>
        <td contenteditable="true">${item.monitor ?? ""}</td>
        <td contenteditable="true">${item.docking ?? ""}</td>
        <td contenteditable="true">${item.note ?? ""}</td>
        <td><button class="remove">❌ Rimuovi</button></td>
      `;
      row.querySelector(".remove").addEventListener("click", () => row.remove());
    });
  } catch (err) {
    console.error("Errore nel caricamento di postazioni.json:", err);
  }
}

function exportJSON() {
  const tbody = document.querySelector("#postazioni tbody");
  if (!tbody) return;

  const rows = Array.from(tbody.rows).map(row => ({
    stanza: row.cells[0].textContent.trim(),
    scrivania: row.cells[1].textContent.trim(),
    workstation: row.cells[2].textContent.trim(),
    monitor: row.cells[3].textContent.trim(),
    docking: row.cells[4].textContent.trim(),
    note: row.cells[5].textContent.trim()
  }));

  const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "postazioni.json";
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById("search")?.addEventListener("input", function () {
  const term = this.value.toLowerCase();
  document.querySelectorAll("#postazioni tbody tr").forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(term) ? "" : "none";
  });
});

window.onload = loadData;

// Listener per il pulsante Salva su GitHub
const saveButton = document.getElementById("save");
if (saveButton) {
  saveButton.addEventListener("click", async () => {
    const rows = Array.from(document.querySelector("#postazioni tbody").rows).map(row => ({
      stanza: row.cells[0].textContent.trim(),
      scrivania: row.cells[1].textContent.trim(),
      workstation: row.cells[2].textContent.trim(),
      monitor: row.cells[3].textContent.trim(),
      docking: row.cells[4].textContent.trim(),
      note: row.cells[5].textContent.trim()
    }));

    const jsonContent = JSON.stringify(rows, null, 2);

    try {
      const response = await fetch("https://api.github.com/repos/<OWNER>/<REPO>/actions/workflows/update-json.yml/dispatches", {
        method: "POST",
        headers: {
          "Authorization": "Bearer <TOKEN_PERSONALE_O_GITHUB_APP>",
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ref: "main",
          inputs: { json_content: jsonContent }
        })
      });

      if (response.ok) {
        alert("✅ Salvataggio avviato! Controlla il workflow su GitHub.");
      } else {
        const error = await response.json();
        console.error(error);
        alert("❌ Errore: " + error.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Errore di rete: " + err.message);
    }
  });
}

