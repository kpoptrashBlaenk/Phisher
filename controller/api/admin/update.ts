import dbQuery from "../../../utils/query-helper"

export async function updateAdminPassword(email: string, password: string): Promise<any> {
  const query = `UPDATE admins
    SET password = $2
    WHERE email = $1`

  const params = [email, password]

  return await dbQuery(query, params)
}

export async function updateAdminCookies(email: string, cookies: string): Promise<any> {
  const query = `UPDATE admins
    SET cookies = $2
    WHERE email = $1`

  const params = [email, cookies]

  return await dbQuery(query, params)
}
