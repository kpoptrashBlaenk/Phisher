import express, { Request, Response } from "express"
import { getTeams } from "./get"

const router = express.Router()

// GET /teams -> Get all Teams
router.get("/teams", async (req: Request, res: Response) => {
  try {
    // Get teams
    const teams = await getTeams()

    return res.status(200).json(teams.rows)
  } catch (error) {
    console.error("Error fetching teams", error)
    return res.status(500).json("Failed to get teams.")
  }
})

export default router
