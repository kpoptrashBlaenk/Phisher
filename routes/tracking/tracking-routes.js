const express = require("express")
const jobPropositionTrackingRoutes = require("./job-proposition-tracking-routes")
const passwordTrackingRoutes = require("./password-tracking-routes")

const router = express.Router()

router.use("/job-proposition", jobPropositionTrackingRoutes)
router.use("/password", passwordTrackingRoutes)

module.exports = router
