import { QueryResult } from "pg"
import { UsersRow } from "../../../types/types"
import dbQuery from "../../../utils/query-helper"

export async function getUsers(): Promise<QueryResult<UsersRow>> {
  const query = `SELECT users.id AS id,
        users.name_first,
        users.name_last,
        users.email,
        teams.id AS team_id,
        teams.team,
        ous.id AS ou_id,
        ous.ou
    FROM users
    JOIN teams ON users.team_id = teams.id
    JOIN ous ON teams.ou_id = ous.id
    ORDER BY users.name_last ASC, users.name_first ASC`

  return await dbQuery(query)
}

export async function getUsersByEmail(emails: string): Promise<QueryResult<UsersRow>> {
  const query = `SELECT users.id AS id,
        users.name_first,
        users.name_last,
        users.email,
        teams.id AS team_id,
        teams.team,
        ous.id AS ou_id,
        ous.ou
    FROM users
    JOIN teams ON users.team_id = teams.id
    JOIN ous ON teams.ou_id = ous.id
    WHERE users.email = ANY($1)
    ORDER BY users.name_last ASC, users.name_first ASC`

  const params = [emails]

  return await dbQuery(query, params)
}
