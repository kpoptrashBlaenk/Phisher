import cookieParser from "cookie-parser"
import express, { Request, Response } from "express"
import adminApiRoutes from "./controller/api/admin/index"
import authenticationApiRoutes from "./controller/api/authentication/index"
import emailApiRoutes from "./controller/api/email/index"
import teamApiRoutes from "./controller/api/team/index"
import trackingRoutes from "./controller/api/tracking/index"
import userApiRoutes from "./controller/api/user/index"
import authenticationRoutes from "./controller/authentication/index"
import mainRoutes from "./controller/main/index"
import templateRoutes from "./controller/template/index"
import authOnly from "./middleware/auth"
import guestOnly from "./middleware/guest"

const app = express()

app.use(express.json()) // To use JSON
app.use(express.static("public")) // To use static files from public
app.use(cookieParser()) // To handle cookies

// Routes
app.use("/api/tracking", trackingRoutes)

app.use("/authentication", guestOnly, authenticationRoutes)
app.use("/api/authentication", guestOnly, authenticationApiRoutes)

app.use("/api/admin", authOnly, adminApiRoutes)
app.use("/api/email", authOnly, emailApiRoutes)
app.use("/api/team", authOnly, teamApiRoutes)
app.use("/api/user", authOnly, userApiRoutes)
app.use("/main", authOnly, mainRoutes)
app.use("/template", authOnly, templateRoutes)

// If route not found, homepage
app.use((req: Request, res: Response) => {
  res.redirect("/")
})

export default app
