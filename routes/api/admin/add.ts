import dbQuery from "../../../utils/query-helper"

async function addAdmin(email: string): Promise<any> {
  const query = `INSERT INTO admins (email)
    VALUES ($1)`

  const params = [email]

  return await dbQuery(query, params)
}

export default addAdmin
