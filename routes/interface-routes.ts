import express, { Request, Response } from "express"
import path from "path"
import redirection from "../utils/redirection"

const router = express.Router()

// Main Interface
router.get("/", async (req: Request, res: Response) => {
  res.sendFile(redirection("views/interface.html"))
})

export default router
