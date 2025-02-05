import express from "express"
import jobPropositionTrackingRoutes from "./job-proposition-tracking-routes"
import passwordTrackingRoutes from "./password-tracking-routes"

const router = express.Router()

router.use("/job-proposition", jobPropositionTrackingRoutes)
router.use("/password", passwordTrackingRoutes)

export default router
