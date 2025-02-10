import { NextFunction, Request, Response } from "express"
import pool from "../config/database-config"
import { AdminsRow } from "../types/database"

// Check if user is authenticated then redirect
async function isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log(req.path)
  console.log(req.cookies.phisher)
  try {
    // Get admin with the saved cookies
    const selectAdminByCoookieQuery = `
      SELECT *
      FROM admins
      WHERE admins.cookies = $1
      `

    const selectAdminByCoookieResult = await pool.query<AdminsRow>(selectAdminByCoookieQuery, [req.cookies.phisher])

    // Check if cookies are equal to admins cookies
    const hasCookies =
      req.cookies.phisher && selectAdminByCoookieResult.rows[0]?.cookies
        ? selectAdminByCoookieResult.rows[0].cookies === req.cookies.phisher
        : false

    // If not logging page (sign)
    if (req.path !== "/authentication/sign" && req.path !== "/sign") {
      // If has cookies, continue
      if (hasCookies) {
        return next()
      }

      // If searching for api (or authentication because of a bug that makes api/auth become auth), continue
      if (req.path.startsWith("/api") || req.path.startsWith("/authentication") || req.path.startsWith("/users") || req.path.startsWith("/track")) {
        return next()
      }

      // Default, go to login page
      return res.redirect("/authentication/sign")
    }

    // If has cookies
    if (hasCookies) {
      return res.redirect("/")
    }

    // Fallback, go to login page
    next()
  } catch (error) {
    console.error("Authentication error", error)
    // instead of return because this must return promise and not void
    next(error)
  }
}

export default isAuthenticated
