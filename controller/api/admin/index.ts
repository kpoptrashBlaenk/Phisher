import express, { Request, Response } from "express"
import addAdmin from "./add"
import deleteAdmin from "./delete"
import { findAdminByEmail, findAdminById } from "./find"
import getAdmins from "./get"

const router = express.Router()

// GET /get -> All Admins
router.get("/get", async (req: Request, res: Response) => {
  try {
    // Get admins
    const admins = await getAdmins()

    res.json(admins.rows)
  } catch (error) {
    console.error("Error getting admins:", error)
    return res.status(500).json("Failed to get admins.")
  }
})

// POST /add -> Add Admin
router.post("/add", async (req: Request, res: Response) => {
  const { email } = req.body

  // Check if email provided
  if (!email) {
    return res.status(422).json("Email is required.")
  }

  try {
    // Find admin
    const admin = await findAdminByEmail(email)

    // Check if admin already exists
    if (admin.rowCount !== 0) {
      return res.status(409).json("Admin already exists.")
    }

    // Add admin
    await addAdmin(email)

    return res.status(201).json("Admin successfully added.")
  } catch (error) {
    console.error("Error adding admin:", error)
    return res.status(500).json("Failed to add admin.")
  }
})

// DELETE /delete/:id -> Delete admin
router.delete("/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params

  // Check if id provided
  if (!id) {
    return res.status(422).json("Id is required.")
  }

  try {
    // Find admin
    const admin = await findAdminById(id)

    // Check if admin exists
    if (admin.rowCount === 0) {
      return res.status(404).json("Admin doesn't exists.")
    }

    // Delete admin
    await deleteAdmin(id)

    return res.status(204).json("Admin deleted successfully.")
  } catch (error) {
    console.error("Error deleting admin:", error)
    return res.status(500).json("Failed to delete admin.")
  }
})

export default router
