import dbQuery from "../../../utils/query-helper"

export async function addTrackingLog(
  userId: string,
  timestamp: string,
  page: string,
  message: string,
  count: number
): Promise<any> {
  const query = `INSERT INTO tracking_log (user_id, timestamp, page, message, count)
  VALUES ($1, $2, $3, $4, $5)`

  const params = [userId, timestamp, page, message, count]

  return await dbQuery(query, params)
}
