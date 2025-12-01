async function loadData() {
  const response = await fetch("postazioni.json");
  const data = await response.json();
  const tbody = document.querySelector("#postazioni tbody");
  tbody.innerHTML = "";

  data.forEach(item => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td contenteditable="true">${item.stanza}</td>
      <td contenteditable="true">${item.scrivania}</td>
      <td contenteditable="true">${item.workstation}</td>
      <td contenteditable="true">${item.monitor}</td>
      <td contenteditable="true">${item.docking}</td>
      <td contenteditable="true">${item.note}</td>
      <td><button onclick="this.closest('tr').remove()">❌ Rimuovi</button></td>
    `;
  });
}

function exportJSON() {
  const rows = Array.from(document.querySelector("#postazioni tbody").rows).map(row => ({
    stanza: row.cells[0].textContent.trim(),
    scrivania: row.cells[1].textContent.trim(),
    workstation: row.cells[2].textContent.trim(),
    monitor: row.cells[3].textContent.trim(),
    docking: row.cells[4].textContent.trim(),
    note: row.cells[5].textContent.trim()
  }));

  const blob = new Blob([JSON.stringify(rows, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "postazioni.json";
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById("search").addEventListener("input", function() {
  const term = this.value.toLowerCase();
  document.querySelectorAll("#postazioni tbody tr").forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(term) ? "" : "none";
  });
});

window.onload = loadData;
