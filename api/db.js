// db.js (เวอร์ชันที่ถูกต้องสำหรับ Vercel Serverless)

const mysql = require('mysql2/promise'); // 💡 ต้องใช้ 'mysql2/promise' เพื่อให้ใช้ async/await และ Pool ได้ง่าย
// const fs = require('fs'); // ❌ ไม่ต้องใช้ fs อีกต่อไป

// 1. สร้าง SSL Config จาก Environment Variable เท่านั้น
const sslConfig = { 
    // Aiven ต้องใช้ SSL
    rejectUnauthorized: true 
};

// 💡 ต้องตรวจสอบว่า Vercel มี CA Certificate ถูกตั้งค่าไว้ใน Environment Variable
if (process.env.DB_CERTIFICATE_CA) { 
    // ตัวแปรนี้จะเก็บเนื้อหาของไฟล์ ca.pem เป็น String
    sslConfig.ca = process.env.DB_CERTIFICATE_CA;
} else {
    // ⚠️ ถ้าไม่พบ certificate ใน production จะมีปัญหา
    console.warn("⚠️ DB_CERTIFICATE_CA not found in Environment Variables! Connection might fail.");
}


// 2. สร้าง Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: sslConfig,
    
    // 💡 การตั้งค่าที่สำคัญสำหรับ Serverless
    waitForConnections: true,
    connectionLimit: 7, // จำกัดจำนวน Connection ที่ Function จะใช้พร้อมกัน
    queueLimit: 0,
});

// 3. Export Pool Promise ให้ server.js ใช้
module.exports = pool;
