import dbQuery from "../../../utils/query-helper"

async function deleteAdmin(id: string): Promise<any> {
  const query = `DELETE FROM admins
    WHERE id = $1`

  const params = [id]

  return await dbQuery(query, params)
}

export default deleteAdmin
