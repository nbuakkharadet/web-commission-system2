import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. ตั้งค่าการจำลองผู้ใช้งาน (Options)
export const options = {
  vus: 20,          // จำลองคนเข้าใช้งานพร้อมกัน 20 คน (Virtual Users)
  duration: '15s',  // ยิงทดสอบต่อเนื่องเป็นเวลา 15 วินาที
  thresholds: {
    http_req_duration: ['p(95)<500'], // เกณฑ์ผ่าน: 95% ของการยิงต้องตอบกลับเร็วกว่า 500ms
    http_req_failed: ['rate<0.01'],   // เกณฑ์ผ่าน: อัตรา Error ต้องน้อยกว่า 1%
  },
};

// 2. ขั้นตอนที่ผู้ใช้งานจำลองแต่ละคนจะทำซ้ำๆ
export default function () {
  const url = 'http://localhost:3000/api/calculate';
  
  const payload = JSON.stringify({
    name: 'Load Test User',
    employeeId: 'T001',
    locks: 10,
    stocks: 20,
    barrels: 30,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // สั่งยิง POST Request ไปที่ API
  const res = http.post(url, payload, params);

  // 3. ตรวจสอบผลลัพธ์ (Assertions)
  check(res, {
    'Status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'Commission is 220': (r) => r.json('commission') === 220,
  });
  sleep(1); // จำลองว่าคนใช้งานพักอ่านผล 1 วินาทีก่อนกดรอบถัดไป
}