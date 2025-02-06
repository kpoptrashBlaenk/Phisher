export type AdminsRow = {
  id: string
  email: string
  password: string
  cookies: string
}
export type TrackingLogRow = {
  user_id: string
  timestamp: string
  page: string
  message: string
  count: string
}

export type UsersRow = {
  id: string
  name_first: string
  name_last: string
  email: string
  team_id: number
}

export type Teams = {
  id: string
  ou_id: string
  team: string
}

export type OUs = {
  id: string
  ou: string
}

export type UsersTeamOURow = UsersRow & {
  team: string
  ou_id: string
  ou: string
}

// export type LogContext = {
//   userId: number
//   page: string
//   message: string
// }

// export type TrackingLogRow = {
//   id: string
//   timestamp: string
//   page: string
//   message: string
//   count: string
//   name_first?: string
//   name_last?: string
//   email?: string
//   ou_id?: string
//   team_id?: number
// }
