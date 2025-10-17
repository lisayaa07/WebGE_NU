// api/db.js (Connection Pool ที่รองรับ Vercel Serverless และ Aiven SSL)

const mysql = require('mysql2/promise');

// 1. สร้าง SSL Config
const sslConfig = { 
    // Aiven ต้องใช้ SSL
    rejectUnauthorized: true 
};

// 2. ตรวจสอบและแปลง Certificate จาก Environment Variable
if (process.env.DB_CERTIFICATE_CA) { 
    // Vercel เก็บค่าหลายบรรทัดเป็น String ที่มี \n แทนการขึ้นบรรทัด
    // เราใช้ .replace(/\\n/g, '\n') เพื่อแปลงกลับเป็นค่าหลายบรรทัดที่ถูกต้อง
    sslConfig.ca = process.env.DB_CERTIFICATE_CA.replace(/\\n/g, '\n');
} else {
    // โค้ดนี้จะรันถ้า DB_CERTIFICATE_CA ไม่มีค่า
    console.warn("⚠️ DB_CERTIFICATE_CA not found in Environment Variables! Check Vercel settings.");
    // ถ้าไม่ตั้งค่าใน production การเชื่อมต่อจะล้มเหลว
}


// 3. สร้าง Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: sslConfig,
    
    // การตั้งค่าสำหรับ Serverless
    waitForConnections: true,
    connectionLimit: 7, 
    queueLimit: 0,
});

// 4. Export Pool Promise
module.exports = pool;
