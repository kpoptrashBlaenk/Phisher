import express from "express"
import jobPropositionTrackingRoutes from "./job-proposition-tracking-routes"
import passwordTrackingRoutes from "./password-tracking-routes"

const router = express.Router()

// Routes for tracking
router.use("/job-proposition", jobPropositionTrackingRoutes)
router.use("/password", passwordTrackingRoutes)

export default router
