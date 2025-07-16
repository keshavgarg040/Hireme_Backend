import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Optional: Load CA certificate if provided
let sslConfig = { rejectUnauthorized: true };
if (process.env.DB_CA_CERT_PATH) {
  try {
    sslConfig.ca = fs.readFileSync(process.env.DB_CA_CERT_PATH);
  } catch (err) {
    console.warn('Could not load CA certificate:', err.message);
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, // optional, set in .env if needed
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslConfig,
});

export default pool; 