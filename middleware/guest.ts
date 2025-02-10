import { NextFunction, Request, Response } from "express"
import { findAdminByCookies } from "../controller/api/admin/find"

async function guestOnly(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Check if cookies exist
    if (req.cookies.phisher) {
      // Find admin by cookies
      const cookies = await findAdminByCookies(req.cookies.phisher)

      // If found, redirect to homepage
      if (cookies.rowCount !== 0) {
        return res.redirect("/")
      }
    }

    return next()
  } catch (error) {
    console.error("Authentication error", error)
  }
}

export default guestOnly
