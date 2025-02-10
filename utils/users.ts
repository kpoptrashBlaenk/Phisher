import pool from "../config/database-config"
import { UsersRow } from "../types/database"

export async function getUsersByMail(emails: string[]): Promise<UsersRow[]> {
  try {
    const selectUsersTeamsOUsByEmailQuery = `
    SELECT
      users.id AS id,
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
    ORDER BY users.name_last ASC, users.name_first ASC
    `

    // Get users by email
    const result = await pool.query<UsersRow>(selectUsersTeamsOUsByEmailQuery, [emails])

    return result.rows
  } catch (error) {
    console.error("Error fetching users", error)
    throw new Error("Failed to fetch users")
  }
}
