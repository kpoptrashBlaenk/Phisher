const express = require("express")
const userApiRoutes = require("./user-api-routes")
const router = express.Router()

// User routes
router.use("/users", userApiRoutes)

module.exports = router
