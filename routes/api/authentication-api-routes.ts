import express, { Request } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
//@ts-ignore because password validator is for older esmodules
import passwordValidator from "password-validator"
import pool from "../../config/database-config"
import { AdminsRow } from "../../types/database"
const router = express.Router()

// POST /register -> Update Admin
router.post("/register", async (req: Request, res: any) => {
  const { email, password } = req.body

  // Check if both
  if (!email && !password) {
    return res.status(400).send({ context: "both", message: "Email and password are required." })
  }

  // Check if email
  if (!email) {
    return res.status(400).send({ context: "email", message: "Email is required." })
  }

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).send({ context: "email", message: "Invalid email format." })
  }

  // Check if password
  if (!password) {
    return res.status(400).send({ context: "password", message: "Password is required." })
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
    return res
      .status(400)
      .send({ context: "password", message: "The password is not strong enough." })
  }

  try {
    const findAccessQuery = `
      SELECT *
      FROM admins
      WHERE admins.email = $1 AND admins.password IS NULL
      `
    const accessResult = await pool.query<AdminsRow>(findAccessQuery, [email])

    // Check if admins access
    if (accessResult.rowCount === 0) {
      return res.status(400).send({ message: "You don't have this right." })
    }

    const findAdminQuery = `
        SELECT  *
        FROM admins
        WHERE admins.email = $1 AND admins.password IS NOT NULL
        `

    const adminResult = await pool.query(findAdminQuery, [email])

    // Check already account
    if (adminResult.rowCount !== 0) {
      return res.status(400).send({ context: "email", message: "Admin already exists." })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const updateAdminQuery = `
    UPDATE admins
    SET password = $2
    WHERE email = $1
    `
    await pool.query(updateAdminQuery, [email, hashedPassword])

    res.status(200).json({ message: "Admin added successfully" })
  } catch (error) {
    console.error("Error during registration:", error)
    return res.status(500).send({ context: "both", message: "Error adding the admin." })
  }
})

// POST /login -> Login Admin
router.post("/login", async (req: Request, res: any) => {
  const { email, password } = req.body

  // Check if password
  if (password && password.length === 0) {
    return res.status(400).send({ context: "password", message: "No password provided." })
  }

  try {
    const findAdminQuery = `
        SELECT  *
        FROM admins
        WHERE admins.email = $1
        `

    const result = await pool.query<AdminsRow>(findAdminQuery, [email])

    // Check if admin exists
    if (result.rowCount === 0 || !result.rows[0]?.password) {
      return res.status(400).send({ context: "email", message: "No user with this email." })
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, result.rows[0].password)
    if (!passwordMatch) {
      return res.status(400).send({ context: "password", message: "The password is wrong." })
    }

    // Create cookies
    const secretKey =
      "nxX23sKMGYjZfdb9aTcpVZuv86suwTwmJEBt1i5l4eNqpDBd1dbgolI2O4LGLz9mOiQA6QcABAItCqIqDMn93g=="
    const token = jwt.sign({ email }, secretKey, { expiresIn: "30d" })

    res.cookie("phisher", token, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
    })

    try {
      const query = `
      UPDATE admins
      SET cookies = $2
      WHERE email = $1
      `

      // Update admin with cookies
      await pool.query(query, [email, token])
    } catch (error) {
      console.error("Error during cookies saving:", error)
      return res.status(500).send({ context: "both", message: "Error saving cookies." })
    }

    // Login
    return res.status(200).send({ redirect: "/" })
  } catch (error) {
    console.error("Error during login:", error)
    return res.status(500).send({ context: "both", message: "Error logging in the admin." })
  }
})

export default router
