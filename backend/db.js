// ✅ ใช้ mysql2 ไม่ใช่ mysql
const mysql = require('mysql2');

// ✅ สร้าง connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: true }
});

// ✅ export ออกไปให้ server.js ใช้งาน
module.exports = connection;

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
