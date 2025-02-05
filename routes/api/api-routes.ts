import express from "express"
import userApiRoutes from "./user-api-routes"
import trackingApiRoutes from "./tracking-api-routes"
import authenticationApiRoutes from "./authentication-api-routes"
import adminApiRoutes from "./admin-api-routes"
import emailApiRoutes from "./email-api-routes"
const router = express.Router()

// User routes
router.use("/users", userApiRoutes)
router.use("/tracking", trackingApiRoutes)
router.use("/authentication", authenticationApiRoutes)
router.use("/admins", adminApiRoutes)
router.use("/email", emailApiRoutes)

export default router
