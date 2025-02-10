import { QueryResult } from "pg"
import { UsersRow } from "../../../types/database"
import dbQuery from "../../../utils/query-helper"

export async function findUserByEmail(email: string): Promise<QueryResult<UsersRow>> {
  const query = `SELECT *
  FROM users
  WHERE users.email = $1`

  const params = [email]

  return await dbQuery(query, params)
}
