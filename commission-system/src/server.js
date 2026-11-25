import express from "express";
import { calculate } from "./calculator.js";
import XLSX from "xlsx";

const app = express();
const PORT = process.env.PORT || 3000;
const history = [];

app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.post("/api/calculate", (req, res) => {
  try {
    const result = calculate(req.body);
    const record = {
      ...result,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    history.unshift(record);
    res.status(201).json(record);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

app.get("/api/export-xlsx", (_req, res) => {
  const rows = history.map((item, index) => ({
    "ลำดับ": index + 1,
    "ชื่อพนักงาน": item.name,
    "รหัสพนักงาน": item.employeeId,
    "ว/ด/ป/เวลา": new Date(item.timestamp).toLocaleString("th-TH"),
    "ยอดขาย": item.sales,
    "ค่าคอมมิชชั่น": item.commission,
    "รายได้": item.income
  }));
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Commission History");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", 'attachment; filename="commission-history.xlsx"');
  res.send(buffer);
});

app.get("/api/history", (req, res) => {
  const limit = Number(req.query.limit || 5);
  if (![5, 10, 20].includes(limit)) {
    return res.status(400).json({ error: "limit ต้องเป็น 5, 10 หรือ 20" });
  }
  res.json(history.slice(0, limit));
});

app.delete("/api/history/:id", (req, res) => {
  const index = history.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "ไม่พบรายการ" });
  history.splice(index, 1);
  res.json({ message: "ลบรายการสำเร็จ" });
});

app.delete("/api/history", (_req, res) => {
  history.length = 0;
  res.json({ message: "ลบประวัติทั้งหมดสำเร็จ" });
});

export { app, history };

if (process.argv[1] && process.argv[1].endsWith("server.js")) {
  app.listen(PORT, () => console.log(`Commission System running at http://localhost:${PORT}`));
}