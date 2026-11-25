const form = document.querySelector("#commissionForm");
const message = document.querySelector("#message");
const result = document.querySelector("#result");
const body = document.querySelector("#historyBody");

const money = (n) => `$${Number(n).toFixed(2)}`;

function numberToThaiBahtWords(value) {
  const n = Math.round(Number(value) * 100) / 100;
  const integer = Math.floor(n);
  const satang = Math.round((n - integer) * 100);
  const digits = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const units = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

  function readBelowMillion(num) {
    if (num === 0) return "";
    let out = "";
    const s = String(num);
    for (let i = 0; i < s.length; i++) {
      const d = Number(s[i]);
      const pos = s.length - i - 1;
      if (!d) continue;
      if (pos === 0) out += d === 1 && s.length > 1 ? "เอ็ด" : digits[d];
      else if (pos === 1) out += d === 2 ? "ยี่" : d === 1 ? "" : digits[d];
      else out += digits[d];
      out += units[pos];
    }
    return out;
  }

  function read(num) {
    if (num < 1000000) return readBelowMillion(num);
    const millions = Math.floor(num / 1000000);
    const rest = num % 1000000;
    return read(millions) + "ล้าน" + readBelowMillion(rest);
  }

  return `${read(integer) || "ศูนย์"}บาท${satang ? read(satang) + "สตางค์" : "ถ้วน"}`;
}

function showMessage(text, type = "warning") {
  message.textContent = text;
  message.classList.remove("hidden");
  message.style.background = type === "success" ? "#d1e7dd" : "#fff3cd";
  message.style.color = type === "success" ? "#0f5132" : "#664d03";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = {
    name: document.querySelector("#name").value,
    employeeId: document.querySelector("#employeeId").value,
    locks: document.querySelector("#locks").value,
    stocks: document.querySelector("#stocks").value,
    barrels: document.querySelector("#barrels").value
  };

  const response = await fetch("/api/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const payload = await response.json();

  if (!response.ok) {
    showMessage(payload.error);
    result.classList.add("hidden");
    return;
  }

  document.querySelector("#sales").textContent = money(payload.sales);
  document.querySelector("#commission").textContent = money(payload.commission);
  document.querySelector("#income").textContent = money(payload.income);
  document.querySelector("#incomeWords").textContent = numberToThaiBahtWords(payload.income);
  result.classList.remove("hidden");
  showMessage("บันทึกผลการคำนวณสำเร็จ", "success");
  await loadHistory();
});

async function loadHistory() {
  const limit = document.querySelector("#historyLimit").value;
  const response = await fetch(`/api/history?limit=${limit}`);
  const rows = await response.json();
  body.innerHTML = "";
  rows.forEach((item, index) => {
    const tr = document.createElement("tr");
    const date = new Date(item.timestamp).toLocaleString("th-TH");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.employeeId}</td>
      <td>${date}</td>
      <td>${money(item.sales)}</td>
      <td>${money(item.commission)}</td>
      <td>${money(item.income)}</td>
      <td><button class="danger" data-id="${item.id}">ลบ</button></td>`;
    body.appendChild(tr);
  });
}

body.addEventListener("click", async (event) => {
  if (!event.target.dataset.id) return;
  if (!confirm("ยืนยันการลบรายการนี้หรือไม่?")) return;
  const response = await fetch(`/api/history/${event.target.dataset.id}`, { method: "DELETE" });
  const payload = await response.json();
  showMessage(payload.message || payload.error, response.ok ? "success" : "warning");
  await loadHistory();
});

document.querySelector("#clearHistory").addEventListener("click", async () => {
  if (!confirm("ยืนยันการลบประวัติทั้งหมดหรือไม่?")) return;
  const response = await fetch("/api/history", { method: "DELETE" });
  const payload = await response.json();
  showMessage(payload.message, "success");
  result.classList.add("hidden");
  await loadHistory();
});

document.querySelector("#historyLimit").addEventListener("change", loadHistory);

document.querySelector("#exportExcel").addEventListener("click", async () => {
  const response = await fetch("/api/export-xlsx");
  if (!response.ok) return showMessage("ไม่สามารถบันทึกไฟล์ได้");
  const blob = await response.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "commission-history.xlsx";
  a.click();
  URL.revokeObjectURL(a.href);
  showMessage("บันทึกไฟล์ .xlsx สำเร็จ", "success");
});

loadHistory();