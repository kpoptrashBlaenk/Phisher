import express from "express"
import adminApiRoutes from "./admin-api-routes"
import authenticationApiRoutes from "./authentication-api-routes"
import emailApiRoutes from "./email-api-routes"
import trackingApiRoutes from "./tracking-api-routes"
import userApiRoutes from "./user-api-routes"

const router = express.Router()

// Api routes
router.use("/users", userApiRoutes)
router.use("/tracking", trackingApiRoutes)
router.use("/authentication", authenticationApiRoutes)
router.use("/admins", adminApiRoutes)
router.use("/email", emailApiRoutes)

export default router
