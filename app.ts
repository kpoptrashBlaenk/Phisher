import cookieParser from "cookie-parser"
import express, { Request, Response } from "express"
import apiRoutes from "./routes/api/api-routes"
import authenticationRoutes from "./controller/authentication/authentication-routes"
import interfaceRoutes from "./controller/main/index"
import templateRoutes from "./controller/template/index"
import trackingRoutes from "./controller/api/tracking/tracking-routes"
import isAuthenticated from "./middleware/middleware"

const app = express()

app.use(express.json()) // To use JSON
app.use(express.static("public")) // To use static files from public
app.use(cookieParser()) // To handle cookies

// Routes
app.use("/track", trackingRoutes)
app.use("/authentication", isAuthenticated, authenticationRoutes)
app.use("/", isAuthenticated, interfaceRoutes)
app.use("/api", isAuthenticated, apiRoutes)
app.use("/template", isAuthenticated, templateRoutes)

// If route not found, homepage
app.use((req: Request, res: Response) => {
  res.redirect("/")
})

export default app
