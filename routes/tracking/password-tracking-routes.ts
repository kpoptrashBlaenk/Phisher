import { Request, Response } from "express"
import express from "express"
import path from "path"
const router = express.Router()
import { trackingLog } from "../../utils/logger"
import redirection from "../../utils/redirection"

const redirect = redirection("views/redirection.html")
const page = "Password Reset"

// Open Image
router.get("/image", async (req: Request, res: Response) => {
  const userId = Number(req.query.userId as string | undefined)

  if (userId) {
    const context = {
      userId: userId,
      page: page,
      message: "Opened image",
    }

    await trackingLog(context)

    res.sendFile(redirect)
  } else {
    res.status(400).send("User ID missing!")
  }
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

    res.sendFile(redirect)
  } else {
    res.status(400).send("User ID missing!")
  }
})

// Open Support
router.get("/support", async (req: Request, res: Response) => {
  const userId = Number(req.query.userId as string | undefined)

  if (userId) {
    const context = {
      userId: userId,
      page: page,
      message: "Opened support",
    }

    await trackingLog(context)

    res.sendFile(redirect)
  } else {
    res.status(400).send("User ID missing!")
  }
})

export default router
