import dbQuery from "../../../utils/query-helper"

export async function deleteUser(id: string): Promise<any> {
  const query = `DELETE FROM users
  WHERE id = $1`

  const params = [id]

  return await dbQuery(query, params)
}
