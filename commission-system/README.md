# Commission System

ระบบคำนวณยอดขาย/ค่าคอมมิชชั่น พร้อมประวัติและ API สำหรับทดสอบอัตโนมัติ

## 1. ติดตั้ง
```bash
npm install
```

## 2. รันระบบ
```bash
npm start
```
เปิด `http://localhost:3000`

## 3. Unit Test / Static Analysis
```bash
npm run test:unit
npm run lint
npm test
```

## 4. SIT / API Testing
นำ `postman/Commission.postman_collection.json` เข้า Postman แล้วรัน collection

## 5. E2E
ต้องเปิดระบบก่อน:
```bash
npm start
```
แล้วอีก terminal:
```bash
npm run test:e2e
```
ต้องติดตั้ง Chrome/Chromedriver หรือ browser driver ที่ Selenium รองรับ

## 6. Performance
ติดตั้ง k6 แล้ว:
```bash
k6 run k6/load-test.js
```

## 7. SonarQube
ตั้งค่า SonarQube/SonarScanner ให้พร้อม แล้ว:
```bash
npm run sonar
```

## การบันทึก .xlsx
ระบบมี endpoint `/api/export-xlsx` และใช้แพ็กเกจ `xlsx` สร้างไฟล์ Excel `.xlsx` จริงจากประวัติการคำนวณ

## สูตร
Sales = 45*Locks + 30*Stocks + 25*Barrels

Commission:
- Sales <= 1000: 10%
- Sales 1001-1800: 100 + 15% ของส่วนที่เกิน 1000
- Sales > 1800: 220 + 20% ของส่วนที่เกิน 1800
