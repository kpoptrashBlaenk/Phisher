import express, { Request, Response } from "express"
import emailTemplatePassword from "../templates/password/password"
import emailTemplateJobProposition from "../templates/job-proposition/job-proposition"

const router = express.Router()

const exampleUser = {
  id: "0",
  name_first: "Name",
  name_last: "Name",
  email: "example@email.com"
}

// Password Reset Template
router.get("/password", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/html")
  res.send(emailTemplatePassword(exampleUser))
})

// Job Proposition Template
router.get("/job-proposition", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/html")
  res.send(emailTemplateJobProposition(exampleUser))
})

export default router
