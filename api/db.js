// api/db.js (ใช้ Connection Pool สำหรับ Serverless)

const mysql = require('mysql2/promise'); 

// 1. สร้าง SSL Config จาก Environment Variable เท่านั้น
const sslConfig = { 
    rejectUnauthorized: true 
};

// 💡 ต้องตรวจสอบว่า Vercel มี CA Certificate ถูกตั้งค่าไว้ใน Environment Variable
if (process.env.DB_CERTIFICATE_CA) { 
    // ใช้เนื้อหาของไฟล์ ca.pem ที่ใส่ไว้ใน Environment Variable
    sslConfig.ca = process.env.DB_CERTIFICATE_CA;
} else {
    // ⚠️ ถ้าไม่พบ certificate ใน production จะมีปัญหา
    console.warn("⚠️ DB_CERTIFICATE_CA not found in Environment Variables! Connection might fail.");
    // 💡 หากเป็น localhost ให้ตั้งค่า SSL เป็น false (สำหรับการทดสอบ)
    if (process.env.NODE_ENV !== 'production') {
        sslConfig = undefined; 
    }
}


// 2. สร้าง Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: sslConfig,
    
    // การตั้งค่าที่สำคัญสำหรับ Serverless
    waitForConnections: true,
    connectionLimit: 7, 
    queueLimit: 0,
});

// 3. Export Pool Promise ให้ serverless function ใช้
module.exports = pool;