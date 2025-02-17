import express, { Request, Response } from "express"
import { findTeam } from "../team/find"
import { addUser } from "./add"
import { deleteUser } from "./delete"
import { findUserByEmail, findUserById } from "./find"
import { getUsers } from "./get"

const router = express.Router()

// GET /get -> All Users with Teams and OUs
router.get("/get", async (req: Request, res: Response) => {
  try {
    // Get users
    const users = await getUsers()

    return res.status(200).json(users.rows)
  } catch (error) {
    console.error("Error fetching users", error)
    return res.status(500).json("Failed to get users")
  }
})

// POST /add -> Add User
router.post("/add", async (req: Request, res: any) => {
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(422).send("Invalid email format.")
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

// POST /find -> Find user by email (this exists purely for testing purposes)
router.post("/find", async (req: Request, res: Response) => {
  const { email } = req.body

  // Check if email provided
  if (!email) {
    return res.status(422).json("Email is required.")
  }

  try {
    // Find user
    const user = await findUserByEmail(email)

    if (user.rowCount === 0) {
      return res.status(404).json("User not found.")
    }

    return res.status(200).json(user.rows[0])
  } catch (error) {
    console.error("Error finding user:", error)
    return res.status(500).json("Failed to find user.")
  }
})

// DELETE /delete/:id -> Delete User with Id
router.delete("/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    // Find user
    const user = await findUserById(id)

    // Check if user exists
    if (user.rowCount === 0) {
      return res.status(404).json("User not found")
    }

    // Delete user
    await deleteUser(id)

    return res.status(200).json("User successfully deleted.")
  } catch (error) {
    console.error("Error deleting user:", error)
    return res.status(500).json("Failed to delete user.")
  }
})

export default router
