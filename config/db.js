import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection on startup
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful');
    console.log(`📊 Connected to database: ${process.env.DB_NAME}`);
    console.log(`🌐 Database host: ${process.env.DB_HOST}`);
    console.log(`🔌 Database port: ${process.env.DB_PORT || 3306}`);
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔧 Please check your environment variables:');
    console.error('   - DB_HOST:', process.env.DB_HOST ? 'Set' : 'Missing');
    console.error('   - DB_PORT:', process.env.DB_PORT ? 'Set' : 'Using default (3306)');
    console.error('   - DB_USER:', process.env.DB_USER ? 'Set' : 'Missing');
    console.error('   - DB_PASSWORD:', process.env.DB_PASSWORD ? 'Set' : 'Missing');
    console.error('   - DB_NAME:', process.env.DB_NAME ? 'Set' : 'Missing');
  }
};

// Test connection on startup
testConnection();

export default pool; 