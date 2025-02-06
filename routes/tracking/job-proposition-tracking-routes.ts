import express, { Request, Response } from "express"
import trackingLog from "../../utils/logger"
import redirection from "../../utils/redirection"

const router = express.Router()

const page = "Job Proposition"
const redirect = redirection("views/sign.html")

// Open Message
router.get("/message", async (req: Request, res: Response) => {
  const userId = Number(req.query.userId as string | undefined)

  if (userId) {
    const context = {
      userId: userId,
      page: page,
      message: "Opened message",
    }

    await trackingLog(context)

    return res.sendFile(redirect)
  }

  res.status(400).send("User ID missing!")
})

// Open Profile
router.get("/profile", async (req: Request, res: Response) => {
  const userId = Number(req.query.userId as string | undefined)

  if (userId) {
    const context = {
      userId: userId,
      page: page,
      message: "Opened profile",
    }

    await trackingLog(context)

    return res.sendFile(redirect)
  }

  res.status(400).send("User ID missing!")
})

export default router
