import dbQuery from "../../../utils/query-helper"

export async function addUser(lastName: string, firstName: string, email: string, teamId: string): Promise<any> {
  const query = `INSERT INTO users (name_last, name_first, email, team_id)
  VALUES ($1, $2, $3, $4)`

  const params = [lastName, firstName, email, teamId]

  return await dbQuery(query, params)
}
