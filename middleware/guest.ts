import { NextFunction, Request, Response } from "express"
import { findAdminByCookies } from "../controller/api/admin/find"

async function guestOnly(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('guestOnly evoked for: ' + req.baseUrl + req.path)
  try {
    // Check if cookies exist
    if (req.cookies.phisher) {
      console.log('cookies exist')
      // Find admin by cookies
      const cookies = await findAdminByCookies(req.cookies.phisher)

      // If found, redirect to homepage
      if (cookies.rowCount !== 0) {
        console.log('cookies found, redirecting')
        return res.redirect("/")
      }
    }

    console.log('go to login')
    return next()
  } catch (error) {
    console.error("Authentication error", error)
  }
}

export default guestOnly
