import { QueryResult } from "pg"
import { TeamsRow } from "../../../types/database"
import dbQuery from "../../../utils/query-helper"

export async function findTeam(team: string): Promise<QueryResult<TeamsRow>> {
  const query = `SELECT *
  FROM teams
  WHERE teams.team = $1`

  const params = [team]

  return await dbQuery(query, params)
}
