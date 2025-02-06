import express, { Request, Response } from "express"
import redirection from "../utils/redirection"

const router = express.Router()

// Registration
router.get("/sign", async (req: Request, res: Response) => {
  res.sendFile(redirection("views/sign.html"))
})

export default router
