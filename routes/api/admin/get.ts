import { QueryResult } from "pg"
import { AdminsRow } from "../../../types/database"
import dbQuery from "../../../utils/query-helper"

async function getAdmins(): Promise<QueryResult<AdminsRow>> {
  const query = `SELECT *
  FROM admins`

  return await dbQuery(query, [])
}

export default getAdmins
