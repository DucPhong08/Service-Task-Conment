import pkg from 'pg';
import dotenv from "dotenv"
dotenv.config()
const { Pool } = pkg;


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD || '123',
    port: process.env.DB_PORT,
  });

pool.on("connect" , () => {
    console.log("Kết nối vs postgresSql thành công");
    
})

pool.on("error", (err) => {
  console.error(" Lỗi kết nối database:", err);
});

export default pool