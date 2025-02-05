import express from "express"
import trackingRoutes from "./routes/tracking/tracking-routes"
import interfaceRoutes from "./routes/interface-routes"
import authenticationRoutes from "./routes/authentication-routes"
import templateRoutes from "./routes/template-routes"
import apiRoutes from "./routes/api/api-routes"
import pool from "./config/database-config"
import cookieParser from "cookie-parser"
import { AdminsRow } from "./types/database"
import { Request, Response, NextFunction } from "express"

const app = express()

app.use(express.json()) // To use JSON
app.use(express.static("public")) // To use static files from public
app.use(cookieParser()) // To handle cookies

const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cookiesQuery = "SELECT * FROM admins WHERE admins.cookies = $1"
    const cookiesResult = await pool.query<AdminsRow>(cookiesQuery, [req.cookies.phisher])

    const hasCookies =
      req.cookies.phisher && cookiesResult.rows[0]?.cookies
        ? cookiesResult.rows[0].cookies === req.cookies.phisher
        : false

    if (req.path !== "/authentication/sign") {
      if (hasCookies) {
        return next()
      }

      // Skip redirect if api (/api/authentication... always becomes /authentication for some reason)
      if (req.path.startsWith("/api") || req.path.startsWith("/authentication")) {
        return next()
      }

      return res.redirect("/authentication/sign")
    }

    if (req.path === "/authentication/sign") {
      if (hasCookies) {
        return res.redirect("/")
      }
    }

    next()
  } catch (error) {
    console.error("Authentication error", error)
    // instead of return because this must return promise and not void
    next(error)
  }
}

app.use("/track", trackingRoutes)
app.use("/api", apiRoutes)
app.use("/authentication", authenticationRoutes)
app.use("/template", templateRoutes)

app.use("/", isAuthenticated, interfaceRoutes)

// Redirect to the main menu if route not found
app.use((req: Request, res: Response) => {
  res.redirect("/")
})

export default app
