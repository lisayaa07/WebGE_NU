// api/db.js
// 
// File for setting up the MySQL Connection Pool for Vercel Serverless Functions.
// Uses mysql2/promise for async operations and handles Aiven's required SSL certificate.

const mysql = require('mysql2/promise');

// 1. SSL Configuration
const sslConfig = { 
    // Aiven requires SSL connection
    rejectUnauthorized: true 
};

// Check for the Certificate Authority (CA) content from Vercel Environment Variables.
if (process.env.DB_CERTIFICATE_CA) { 
    // IMPORTANT: Vercel stores multi-line strings as a single line with escaped newlines (\n).
    // This line converts the escaped string back into the multi-line format required by the driver.
    sslConfig.ca = process.env.DB_CERTIFICATE_CA.replace(/\\n/g, '\n');
} else {
    // Warning if the certificate is missing in the production environment.
    console.warn("⚠️ DB_CERTIFICATE_CA not found in Environment Variables! Connection might fail.");
}


// 2. Create the Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: sslConfig,
    
    // Configuration optimal for Serverless environments:
    waitForConnections: true,
    connectionLimit: 7, // Limits the number of concurrent connections per function instance.
    queueLimit: 0,
    // Enable debug logging if needed (optional)
    // debug: ['ComQueryPacket', 'ResultSet']
});

// 3. Export the Pool Promise 
// All API routes should use: const [rows] = await db.query(sql, [params]);
module.exports = pool;
