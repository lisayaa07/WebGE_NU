// backend/db.js
const mysql = require('mysql2/promise');

// SSL handling helper (รองรับ raw PEM, escaped \n, และ base64)
function getCaFromEnv() {
  const raw = process.env.DB_CERTIFICATE_CA;
  if (!raw) return undefined;
  let v = raw.trim();
  if (v.includes('-----BEGIN CERTIFICATE-----')) {
    return v.replace(/\\n/g, '\n');
  }
  const base64Like = /^[A-Za-z0-9+/=\r\n]+$/.test(v);
  if (base64Like) {
    try {
      const decoded = Buffer.from(v, 'base64').toString('utf8');
      if (decoded.includes('-----BEGIN CERTIFICATE-----')) return decoded;
      return v.replace(/\\n/g, '\n');
    } catch (e) {
      return v.replace(/\\n/g, '\n');
    }
  }
  return v.replace(/\\n/g, '\n');
}

const ca = getCaFromEnv();
const sslConfig = ca ? { rejectUnauthorized: true, ca } : undefined;

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONN_LIMIT ? Number(process.env.DB_CONN_LIMIT) : 7,
  queueLimit: 0
};

let pool;
try {
  pool = mysql.createPool(poolConfig);
  console.log(`✅ MySQL pool created for ${process.env.DB_HOST}/${process.env.DB_NAME}`);
} catch (err) {
  console.error('❌ Error creating MySQL pool', err);
  throw err;
}

module.exports = pool;
