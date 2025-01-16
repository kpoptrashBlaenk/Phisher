const express = require("express")
const passwordValidator = require("password-validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const pool = require("../../config/database-config")
const router = express.Router()

// Register POST
router.post("/register", async (req, res) => {
  const { email, password } = req.body

  // Check both
  if (!email && !password) {
    return res.status(400).send({ context: "both", message: "Email and password are required." })
  }

  // Check email
  if (!email) {
    return res.status(400).send({ context: "email", message: "Email is required." })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).send({ context: "email", message: "Invalid email format." })
  }

  // Check password
  if (!password) {
    return res.status(400).send({ context: "password", message: "Password is required." })
  }

  const schema = new passwordValidator()
  schema.is().min(8)
  schema.is().max(20)
  schema.has().uppercase()
  schema.has().lowercase()
  schema.has().digits()
  schema.has().not().spaces()

  if (!schema.validate(password)) {
    return res
      .status(400)
      .send({ context: "password", message: "The password is not strong enough." })
  }

  // Try register
  try {
    // Check if admins access
    const findAccessQuery = `
      SELECT *
      FROM admins_access
      WHERE admins_access.email = $1
      `
    const accessResult = await pool.query(findAccessQuery, [email])

    if (!accessResult.rowCount > 0) {
      return res.status(400).send({message: "You don't have this right."})
    }

    // Check already account
    const findAdminQuery = `
        SELECT  *
        FROM admins
        WHERE admins.email = $1
        `

    const result = await pool.query(findAdminQuery, [email])

    if (result.rowCount > 0) {
      return res.status(400).send({message: "User already exists."})
    }

    // Register
    const hashedPassword = await bcrypt.hash(password, 10)

    const insertAdminQuery = `
        INSERT INTO admins (email, password)
        VALUES ($1, $2)
        RETURNING id
        `

    const insertResult = await pool.query(insertAdminQuery, [email, hashedPassword])

    if (insertResult.rowCount > 0) {
      return res.status(201).send()
    }

    return res.status(500).send("Error adding the admin.")
  } catch (error) {
    console.error("Error during registration:", error)
    return res.status(500).send("Error adding the admin.")
  }
})

// Login POST
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  // Try login
  try {
    // Check for email
    const findAdminQuery = `
        SELECT  *
        FROM admins
        WHERE admins.email = $1
        `

    const result = await pool.query(findAdminQuery, [email])

    if (!result.rowCount > 0) {
      return res.status(400).send({ context: "email", message: "No user with this email." })
    }

    // Check for password
    const passwordMatch = bcrypt.compare(password, result.rows[0].password)
    if (!passwordMatch) {
      return res.status(400).send({ context: "password", message: "The password is wrong." })
    }

    // Cookies
    const secretKey =
      "nxX23sKMGYjZfdb9aTcpVZuv86suwTwmJEBt1i5l4eNqpDBd1dbgolI2O4LGLz9mOiQA6QcABAItCqIqDMn93g=="
    const token = jwt.sign({ email }, secretKey, { expiresIn: "24h" })

    res.cookie("phisher", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only https in production (need ssl/tls in prod)
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: "strict",
    })

    // Login
    return res.status(201).send({ redirect: "/" })
  } catch (error) {
    console.error("Error during login:", error)
    return res.status(500).send("Error logging in the admin.")
  }
})

module.exports = router
