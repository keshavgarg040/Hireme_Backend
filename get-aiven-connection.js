import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Aiven Connection Helper\n');

console.log('📋 Current Environment Variables:');
console.log('   DB_HOST:', process.env.DB_HOST || 'NOT SET');
console.log('   DB_PORT:', process.env.DB_PORT || 'NOT SET (using default 3306)');
console.log('   DB_USER:', process.env.DB_USER || 'NOT SET');
console.log('   DB_NAME:', process.env.DB_NAME || 'NOT SET');
console.log('   DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'NOT SET');

console.log('\n💡 For Aiven MySQL, you typically need:');
console.log('   - DB_PORT: Usually 12345 (check your Aiven dashboard)');
console.log('   - SSL: Enabled (already configured in db.js)');
console.log('   - Host: Your Aiven host (looks like: your-db-your-project.aivencloud.com)');

console.log('\n🔧 To get the correct connection details:');
console.log('   1. Go to your Aiven dashboard');
console.log('   2. Select your MySQL service');
console.log('   3. Go to "Overview" tab');
console.log('   4. Look for "Connection information"');
console.log('   5. Copy the host, port, database name, and credentials');

console.log('\n📝 Example .env file for Aiven:');
console.log('   DB_HOST=your-db-your-project.aivencloud.com');
console.log('   DB_PORT=12345');
console.log('   DB_USER=avnadmin');
console.log('   DB_PASSWORD=your-password');
console.log('   DB_NAME=defaultdb');
console.log('   JWT_SECRET=your-jwt-secret');

console.log('\n⚠️  Make sure to:');
console.log('   - Add DB_PORT to your environment variables');
console.log('   - Check if your IP needs to be whitelisted in Aiven');
console.log('   - Verify the database service is running'); 