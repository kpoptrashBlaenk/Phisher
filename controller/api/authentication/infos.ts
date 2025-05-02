import { QueryResult } from "pg"
import dbQuery from "../../../utils/query-helper"

async function getInfos(): Promise<QueryResult<any>> {
  const query = `SELECT *
    FROM infos`

  return await dbQuery(query, [])
}

export default getInfos
