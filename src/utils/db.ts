import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// you can sha save to db if you want but i no get strength for am abeg!!


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;