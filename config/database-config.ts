import dotenv from "dotenv"
import pg from "pg"
const { Pool } = pg

dotenv.config()

// Database Connection
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_INTERNAL_HOST || process.env.DB_EXTERNAL_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
})

export default pool
