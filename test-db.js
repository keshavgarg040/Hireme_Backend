import dotenv from 'dotenv';
import pool from './config/db.js';

dotenv.config();

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');
  
  console.log('📋 Environment Variables:');
  console.log('   DB_HOST:', process.env.DB_HOST || 'NOT SET');
  console.log('   DB_PORT:', process.env.DB_PORT || 'Using default (3306)');
  console.log('   DB_USER:', process.env.DB_USER || 'NOT SET');
  console.log('   DB_NAME:', process.env.DB_NAME || 'NOT SET');
  console.log('   DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'NOT SET');
  console.log('');

  try {
    // Test basic connection
    console.log('🔄 Testing connection...');
    const connection = await pool.getConnection();
    console.log('✅ Connection successful!');
    
    // Test a simple query
    console.log('🔄 Testing query...');
    const [rows] = await connection.query('SELECT 1 as test');
    console.log('✅ Query successful!');
    console.log('   Test result:', rows[0]);
    
    // Test database name
    const [dbRows] = await connection.query('SELECT DATABASE() as current_database');
    console.log('📊 Current database:', dbRows[0].current_database);
    
    // Test if tables exist
    console.log('🔄 Checking tables...');
    const [tableRows] = await connection.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ?
    `, [process.env.DB_NAME]);
    
    console.log('📋 Available tables:');
    if (tableRows.length === 0) {
      console.log('   ⚠️  No tables found in database');
    } else {
      tableRows.forEach(row => {
        console.log(`   - ${row.TABLE_NAME}`);
      });
    }
    
    connection.release();
    console.log('\n🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Database connection test failed!');
    console.error('Error details:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.error('\n💡 Possible solutions for Aiven:');
      console.error('   - Check if the database service is running in Aiven');
      console.error('   - Verify the DB_HOST and DB_PORT are correct');
      console.error('   - Ensure your IP is whitelisted in Aiven (if required)');
      console.error('   - Check if you need to use SSL connection');
      console.error('   - Verify the connection string from Aiven dashboard');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Possible solutions:');
      console.error('   - Check DB_USER and DB_PASSWORD');
      console.error('   - Verify user permissions in Aiven');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Possible solutions:');
      console.error('   - Check DB_NAME is correct');
      console.error('   - Verify the database exists in Aiven');
    }
  } finally {
    process.exit(0);
  }
}

testDatabaseConnection(); 