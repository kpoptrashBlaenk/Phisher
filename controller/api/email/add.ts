import dbQuery from "../../../utils/query-helper"

export async function addEmail(userId: string, template: string): Promise<any> {
  const query = `INSERT INTO emails(user_id, template)
  VALUES ($1, $2)`

  const params = [userId, template]

  return await dbQuery(query, params)
}
