const fs = require("fs")
const path = require("path")

const COOKIE_PATH = path.resolve("tests", "auth-cookie.txt")


beforeAll(() => {
  if (!fs.existsSync(COOKIE_PATH)) {
    throw new Error("Authentication cookies file is missing!")
  }

  global.authCookies = fs.readFileSync(COOKIE_PATH, "utf-8")
})

afterAll(() => {
  if (fs.existsSync(COOKIE_PATH)) {
    fs.unlinkSync(COOKIE_PATH)
  }
})
