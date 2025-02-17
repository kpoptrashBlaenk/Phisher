import request from "supertest"
import dotenv from "dotenv"

dotenv.config()

export default async () => {
  const loginRes = await request(`http://localhost:${process.env.PORT}`).post("/api/authentication/login").send({
    email: process.env.ADMIN_ACCESS_EMAIL,
    password: process.env.ADMIN_ACCESS_PASSWORD,
  })

  global.authCookies = loginRes.headers["set-cookie"]
}
