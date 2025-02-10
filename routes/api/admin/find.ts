import { QueryResult } from "pg"
import { AdminsRow } from "../../../types/database"
import dbQuery from "../../../utils/query-helper"

export async function findAdminByEmail(email: string): Promise<QueryResult<AdminsRow>> {
  const query = `SELECT *
    FROM admins
    WHERE admins.email = $1`

  const params = [email]

  return await dbQuery(query, params)
}

export async function findAdminByEmailNoPassword(email: string): Promise<QueryResult<AdminsRow>> {
  const query = `SELECT *
    FROM admins
    WHERE admins.email = $1 AND admins.password IS NULL`

  const params = [email]

  return await dbQuery(query, params)
}

export async function findAdminByEmailWithPassword(email: string): Promise<QueryResult<AdminsRow>> {
  const query = `SELECT *
    FROM admins
    WHERE admins.email = $1 AND admins.password IS NOT NULL`

  const params = [email]

  return await dbQuery(query, params)
}

export async function findAdminById(id: string): Promise<QueryResult<AdminsRow>> {
  const query = `SELECT *
    FROM admins
    WHERE admins.id = $1`

  const params = [id]

  return await dbQuery(query, params)
}
