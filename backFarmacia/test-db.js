
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log('Testing DB Access...');
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log('Successfully connected to Farmacia DB!');
        
        // Test query
        const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
        console.log('Query Test:', rows[0].solution === 2 ? 'PASS' : 'FAIL');
        
        // Test Table
        const [showTables] = await connection.execute("SHOW TABLES LIKE 'producto'");
        if (showTables.length > 0) {
            console.log("Table 'producto' exists.");
            const [count] = await connection.execute('SELECT COUNT(*) as count FROM producto');
            console.log(`Found ${count[0].count} product rows.`);
        } else {
            console.log("CRITICAL: Table 'producto' DOES NOT EXIST.");
        }

        await connection.end();
    } catch (err) {
        console.error('DB Connection Failed:', err.message);
        if(err.code === 'ER_BAD_DB_ERROR') {
            console.log("HINT: The database 'farmacia_db' might not exist. Check if you ran the database.sql script.");
        }
        if(err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log("HINT: Incorrect username or password in .env file.");
        }
    }
}

testConnection();
