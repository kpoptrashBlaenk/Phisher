import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import request from "supertest"

dotenv.config()

const COOKIE_PATH = path.resolve("tests", "auth-cookie.txt")

export default async () => {
  const loginRes = await request(`http://localhost:${process.env.PORT}`).post("/api/authentication/login").send({
    email: process.env.ADMIN_ACCESS_EMAIL,
    password: process.env.ADMIN_ACCESS_PASSWORD,
  })

  const authCookies = loginRes.headers["set-cookie"][0]

  fs.writeFileSync(COOKIE_PATH, authCookies, "utf-8")
}
