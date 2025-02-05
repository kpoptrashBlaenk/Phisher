export type AdminsRow = {
  id: number
  email: string
  password: string
  cookies: string
}

export type LogContext = {
  userId: number
  page: string
  message: string
}

export type UsersRow = {
  id: string
  name_first: string
  name_last: string
  email: string
  team_id?: number
  team_name?: string
  ou_id?: string
  ou_name?: string
}

export type TrackingLogRow = {
  id: string
  timestamp: string
  page: string
  message: string
  count: string
  name_first?: string
  name_last?: string
  email?: string
  ou_id?: string
  team_id?: number
}

export type Team = {
  id: string
  ou_id: string
  team: string
}
