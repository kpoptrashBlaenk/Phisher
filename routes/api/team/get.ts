import { QueryResult } from "pg"
import { TeamsRow } from "../../../types/database"
import dbQuery from "../../../utils/query-helper"

export async function getTeams(): Promise<QueryResult<TeamsRow>> {
  const query = `SELECT *
  FROM teams`

  return await dbQuery(query)
}
