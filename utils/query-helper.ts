import { QueryResult } from "pg"
import pool from "../config/database-config"

async function dbQuery(query: string, params: any[] = []): Promise<QueryResult> {
  try {
    const result = await pool.query(query, params)
    return result
  } catch (error) {
    throw new Error()
  }
}

export default dbQuery
