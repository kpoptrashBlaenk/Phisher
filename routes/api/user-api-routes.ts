import express, { Request, Response } from "express"
import pool from "../../config/database-config"
import { Teams, UsersRow, UsersTeamOURow } from "../../types/database"
const router = express.Router()

// GET / -> All Users with Teams and OUs
router.get("/", async (req: Request, res: Response) => {
  try {
    const selectUsersTeamsOUsQuery = `
    SELECT
      users.id AS id,
      users.name_first,
      users.name_last,
      users.email,
      teams.id AS team_id,
      teams.team,
      ous.id AS ou_id,
      ous.ou
    FROM users
    JOIN teams ON users.team_id = teams.id
    JOIN ous ON teams.ou_id = ous.id
    ORDER BY users.name_last ASC, users.name_first ASC
    `

    const selectUsersTeamsOUsResult = await pool.query<UsersTeamOURow>(selectUsersTeamsOUsQuery)

    res.json(selectUsersTeamsOUsResult.rows)
  } catch (error) {
    console.error("Error fetching users", error)
    res.status(500).json({ error: "Failed to fetch users" })
  }
})

// POST /get -> Get certain users
router.post("/get", async (req: Request, res: any) => {
  const { emails } = req.body

  // Check if email provided
  if (emails?.length !== 0) {
    return res.status(400).json({ message: "No emails provided" })
  }

  try {
    const selectUsersTeamsOUsByEmailQuery = `
    SELECT
      users.id AS id,
      users.name_first,
      users.name_last,
      users.email,
      teams.id AS team_id,
      teams.team,
      ous.id AS ou_id,
      ous.ou
    FROM users
    JOIN teams ON users.team_id = teams.id
    JOIN ous ON teams.ou_id = ous.id
    WHERE users.email = ANY($1)
    ORDER BY users.name_last ASC, users.name_first ASC
    `

    // Get users by email
    const selectUsersTeamsOUsByEmailResult = await pool.query<UsersRow>(selectUsersTeamsOUsByEmailQuery, [emails])

    return res.json(selectUsersTeamsOUsByEmailResult.rows)
  } catch (error) {
    console.error("Error fetching users", error)
    return res.status(500).json({ error: "Failed to fetch users" })
  }
})

// POST / -> Add User
router.post("/", async (req: Request, res: any) => {
  const { lastName, firstName, email, team } = req.body

  // Check if last name provided
  if (!lastName) {
    return res.status(400).json({ message: "Last name is required" })
  }

  // Check if first name provided
  if (!firstName) {
    return res.status(400).json({ message: "First name is required" })
  }

  // Check if email provided
  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  // Check if team provided
  if (!team) {
    return res.status(400).json({ message: "Team is required" })
  }

  try {
    const selectTeamsByTeamQuery = `
    SELECT *
    FROM teams
    WHERE teams.team = $1`

    const selectTeamsByTeamQueryResult = await pool.query<Teams>(selectTeamsByTeamQuery, [team])

    // Check if team exist
    if (selectTeamsByTeamQueryResult.rowCount === 0) {
      return res.status(400).json({ message: "Team not found" })
    }

    const selectUsersByEmailQuery = `
    SELECT *
    FROM users
    WHERE users.email = $1
    `

    const selectUsersByEmailResult = await pool.query<UsersRow>(selectUsersByEmailQuery, [email])

    // Check if user already
    if (selectUsersByEmailResult.rowCount !== 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    const insertUsersQuery = `
    INSERT INTO users (name_last, name_first, email, team_id)
    VALUES ($1, $2, $3, $4)
    `

    // Add new user
    await pool.query(insertUsersQuery, [lastName, firstName, email, selectTeamsByTeamQueryResult.rows[0].id])

    res.json({ message: "User added successfully" })
  } catch (error) {
    console.error("Error adding user:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// DELETE /:id -> Delete User with Id
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const deleteUsersQuery = `
    DELETE FROM users
    WHERE id = $1
    `

    // Delete user
    await pool.query(deleteUsersQuery, [id])

    res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ error: "Failed to delete user" })
  }
})

// GET /teams -> Get all Teams
router.get("/teams", async (req: Request, res: Response) => {
  try {
    const selectTeamsQuery = `
    SELECT *
    FROM teams
    ORDER BY team ASC`

    // Get all teams
    const selectTeamsResult = await pool.query(selectTeamsQuery)

    res.json(selectTeamsResult.rows)
  } catch (error) {
    console.error("Error fetching teams", error)
    res.status(500).json({ error: "Failed to fetch teams" })
  }
})

export default router
