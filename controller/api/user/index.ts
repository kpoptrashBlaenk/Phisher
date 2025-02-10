import express, { Request, Response } from "express"
import { getUsersByMail } from "../../../utils/users"
import { findTeam } from "../team/find"
import { addUser } from "./add"
import { deleteUser } from "./delete"
import { findUserByEmail } from "./find"
import { getUsers } from "./get"

const router = express.Router()

// GET / -> All Users with Teams and OUs
router.get("/", async (req: Request, res: Response) => {
  try {
    // Get users
    const users = await getUsers()

    return res.status(500).json(users.rows)
  } catch (error) {
    console.error("Error fetching users", error)
    return res.status(500).json({ error: "Failed to get users" })
  }
})

// POST /get -> Get certain users
router.post("/get", async (req: Request, res: any) => {
  const { emails } = req.body

  // Check if email provided
  if (emails?.length === 0) {
    return res.status(400).json("No emails provided.")
  }

  try {
    // Get users by email
    const users = await getUsersByMail(emails)

    return res.status(200).json(users)
  } catch (error) {
    console.error("Error fetching users", error)
    return res.status(500).json("Failed to get users.")
  }
})

// POST / -> Add User
router.post("/", async (req: Request, res: any) => {
  const { lastName, firstName, email, team } = req.body

  // Check if last name provided
  if (!lastName) {
    return res.status(422).json("Last name is required.")
  }

  // Check if first name provided
  if (!firstName) {
    return res.status(422).json("First name is required.")
  }

  // Check if email provided
  if (!email) {
    return res.status(422).json("Email is required.")
  }

  // Check if team provided
  if (!team) {
    return res.status(422).json("Team is required.")
  }

  try {
    // Find team
    const foundTeam = await findTeam(team)

    // Check if team exist
    if (foundTeam.rowCount === 0) {
      return res.status(404).json("Team not found.")
    }

    // Find user
    const user = await findUserByEmail(email)

    // Check if user exists already
    if (user.rowCount !== 0) {
      return res.status(409).json("User already exists")
    }

    await addUser(lastName, firstName, email, foundTeam.rows[0].id)

    return res.status(201).json("User succesfully added.")
  } catch (error) {
    console.error("Error adding user:", error)
    return res.status(500).json("Failed to add user.")
  }
})

// DELETE /:id -> Delete User with Id
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    // Delete user
    await deleteUser(id)

    return res.status(204).json("User successfully deleted.")
  } catch (error) {
    console.error("Error deleting user:", error)
    return res.status(500).json("Failed to delete user.")
  }
})

export default router
