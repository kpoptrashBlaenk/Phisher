import { QueryResult } from "pg"
import dbQuery from "../../../utils/query-helper"
import { UsersTrackingLogRow } from "../../../types/database"

export async function getTrackingLogs(): Promise<QueryResult<UsersTrackingLogRow>> {
  const query = `SELECT *
  FROM tracking_log
  JOIN users ON tracking_log.user_id = users.id
  ORDER BY tracking_log.timestamp DESC`

  return await dbQuery(query)
}

export async function getTrackingLogsById(id: string): Promise<QueryResult<UsersTrackingLogRow>> {
  const query = `SELECT *
  FROM tracking_log
  WHERE tracking_log.user_id = $1`

  const params = [id]

  return await dbQuery(query, params)
}
