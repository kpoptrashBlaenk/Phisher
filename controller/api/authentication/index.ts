import express, { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
//@ts-ignore because password validator is for older esmodules
import passwordValidator from "password-validator"
import { findAdminByEmail, findAdminByEmailNoPassword, findAdminByEmailWithPassword } from "../admin/find"
import { updateAdminCookies, updateAdminPassword } from "../admin/update"

const router = express.Router()

// POST /register -> Update Admin
router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Check if both
  if (!email && !password) {
    return res.status(422).send({ context: "both", message: "Email and password are required." })
  }

  // Check if email
  if (!email) {
    return res.status(422).send({ context: "email", message: "Email is required." })
  }

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(422).send({ context: "email", message: "Invalid email format." })
  }

  // Check if password
  if (!password) {
    return res.status(422).send({ context: "password", message: "Password is required." })
  }

  // Password validator
  const schema = new passwordValidator()
  schema.is().min(8)
  schema.is().max(20)
  schema.has().uppercase()
  schema.has().lowercase()
  schema.has().digits()
  schema.has().not().spaces()

  // Validate password
  if (!schema.validate(password)) {
    return res.status(422).send({ context: "password", message: "The password is not strong enough." })
  }

  try {
    // Find admin with no password
    const validAdmin = await findAdminByEmailNoPassword(email)

    // Check if admins access
    if (validAdmin.rowCount === 0) {
      return res.status(403).send({ context: "both", message: "You don't access rights to register an admin." })
    }

    // Find admin with password
    const admin = await findAdminByEmailWithPassword(email)

    // Check account exists already
    if (admin.rowCount !== 0) {
      return res.status(409).send({ context: "both", message: "Admin already exists." })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update password
    await updateAdminPassword(email, hashedPassword)

    return res.status(200).json({ context: "both", message: "Admin added successfully" })
  } catch (error) {
    console.error("Error during registration:", error)
    return res.status(500).json({ context: "both", message: "Error registering the admin." })
  }
})

// POST /login -> Login Admin
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Check if email
  if (email && email.length === 0) {
    return res.status(422).json({ context: "email", message: "No email provided." })
  }

  // Check if password
  if (password && password.length === 0) {
    return res.status(422).json({ context: "password", message: "No password provided." })
  }

  try {
    // Find admin by email
    const admin = await findAdminByEmail(email)

    // Check if admin exists
    if (admin.rowCount === 0 || !admin.rows[0]?.password) {
      return res.status(404).json({ context: "email", message: "No user with this email." })
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, admin.rows[0].password)
    if (!passwordMatch) {
      return res.status(400).json({ context: "password", message: "Wrong password." })
    }

    // Create cookies
    const secretKey = "nxX23sKMGYjZfdb9aTcpVZuv86suwTwmJEBt1i5l4eNqpDBd1dbgolI2O4LGLz9mOiQA6QcABAItCqIqDMn93g=="
    const token = jwt.sign({ email }, secretKey, { expiresIn: "30d" })

    res.cookie("phisher", token, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
    })

    // Update cookies
    await updateAdminCookies(email, token)

    return res.status(200).json({ redirect: "/" })
  } catch (error) {
    console.error("Error during login:", error)
    return res.status(500).json({ context: "both", message: "Error logging in the admin." })
  }
})

export default router
