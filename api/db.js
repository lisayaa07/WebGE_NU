const mysql = require('mysql2/promise');

const sslConfig = { rejectUnauthorized: true };

if (process.env.DB_CERTIFICATE_CA) {
  sslConfig.ca = process.env.DB_CERTIFICATE_CA.replace(/\\n/g, '\n');
} else {
  // ถ้า DB ไม่ต้องการ SSL ให้ลบหรือตั้ง false
  console.warn("DB_CERTIFICATE_CA not set — SSL CA missing");
}

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 7,
  queueLimit: 0
};

// Reuse pool across lambda warm invocations
if (!global.__MY_APP_MYSQL_POOL) {
  global.__MY_APP_MYSQL_POOL = mysql.createPool(poolConfig);
}
module.exports = global.__MY_APP_MYSQL_POOL;
