import express, { Request, Response } from "express"
import redirection from "../../utils/redirection"

const router = express.Router()

// Login & Register
router.get("/", async (req: Request, res: Response) => {
  res.sendFile(redirection("views/sign.html"))
})

export default router
