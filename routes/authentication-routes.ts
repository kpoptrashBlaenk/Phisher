import { Request, Response } from "express"
import express from "express"
import redirection from "../utils/redirection"

const router = express.Router()

// Registration
router.get("/sign", async (req: Request, res: Response) => {
  // Send the file
  res.sendFile(redirection("views/sign.html"))
})

export default router
