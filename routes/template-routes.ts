import express, { Request, Response } from "express"
import emailTemplateJobProposition from "../templates/job-proposition/job-proposition"
import emailTemplatePassword from "../templates/password/password"
import { UsersRow } from "../types/database"

const router = express.Router()

// For viewing the template
const exampleUser: UsersRow = {
  id: "0",
  name_first: "Example First Name",
  name_last: "Example Last Name",
  email: "example@email.com",
  team_id: 0,
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
