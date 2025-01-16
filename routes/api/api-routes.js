const express = require("express")
const userApiRoutes = require("./user-api-routes")
const trackingApiRoutes = require("./tracking-api-routes")
const authenticationApiRoutes = require("./authentication-api-routes")
const adminApiRoutes = require("./admin-api-routes")
const router = express.Router()

// User routes
router.use("/users", userApiRoutes)
router.use("/tracking", trackingApiRoutes)
router.use("/authentication", authenticationApiRoutes)
router.use("/admins", adminApiRoutes)

module.exports = router
