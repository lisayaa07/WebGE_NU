const mysql = require("mysql2");
const fs = require("fs");
const { Pool } = require('pg');
require("dotenv").config(); // โหลดค่าจาก .env

const sslConfig = {
  rejectUnauthorized: true,
};

// ตรวจสอบว่าเราทำงานบน Render หรือไม่ (โดยดูจากตัวแปรที่เราเพิ่งสร้าง)
if (process.env.AIVEN_CA_CERT) {
  // ถ้ามีตัวแปรนี้ (ทำงานบน Render) ให้อ่านค่า ca จากตัวแปร
  sslConfig.ca = process.env.AIVEN_CA_CERT;
} else {
  // มิฉะนั้น (ทำงานบนเครื่อง) ให้อ่านจากไฟล์เหมือนเดิม
  sslConfig.ca = fs.readFileSync('./certificate/ca.pem').toString();
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig, // ← นำ object ที่ตั้งค่าแล้วมาใช้ตรงนี้
});

module.exports = pool;
