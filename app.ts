import cookieParser from "cookie-parser"
import express, { Request, Response } from "express"
import adminRoutes from "./controller/api/admin/index"
import authenticationRoutes from "./controller/api/authentication/index"
import emailRoutes from "./controller/api/email/index"
import teamRoutes from "./controller/api/team/index"
import trackingRoutes from "./controller/api/tracking/index"
import userRoutes from "./controller/api/user/index"
import mainRoutes from "./controller/main/index"
import signRoutes from "./controller/sign/index"
import templateRoutes from "./controller/template/index"
import authOnly from "./middleware/auth"
import guestOnly from "./middleware/guest"

const app = express()

app.use(express.json()) // To use JSON
app.use(express.static("public")) // To use static files from public
app.use(cookieParser()) // To handle cookies

// Routes
app.use("/tracking", trackingRoutes)

app.use("/authentication", guestOnly, authenticationRoutes)
app.use("/sign", guestOnly, signRoutes)

app.use("/admin", authOnly, adminRoutes)
app.use("/email", authOnly, emailRoutes)
app.use("/team", authOnly, teamRoutes)
app.use("/user", authOnly, userRoutes)
app.use("/main", authOnly, mainRoutes)
app.use("/template", authOnly, templateRoutes)

// If route not found, homepage
app.use((req: Request, res: Response) => {
  res.redirect("/")
})

export default app
