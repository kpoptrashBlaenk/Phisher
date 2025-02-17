const request = require("supertest")
const dotenv = require("dotenv")

dotenv.config()

const defaultEmail = "foo@bar.com"
const defaultTeam = "DIRECTION EIC LORCA"
const defaultTemplate = "Password Reset"

let id

// Before All
beforeAll(async () => {
  // Add User
  await request(`http://localhost:${process.env.PORT}`)
    .post("/api/user/add")
    .send({
      firstName: "foo",
      lastName: "bar",
      email: defaultEmail,
      team: defaultTeam,
    })
    .set("Cookie", global.authCookies)

  // Find User
  const findUserRes = await request(`http://localhost:${process.env.PORT}`)
    .post("/api/user/find")
    .send({ email: defaultEmail })
    .set("Cookie", global.authCookies)

  // Save User
  id = findUserRes.body.id
})

// ##### /EMAIL/SEND #####

// No emails
describe("Send emails", () => {
  it("should return a 404 'No users selected'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/email/send")
      .send({
        template: defaultTemplate,
      })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(404)
  })
})

// User not found
describe("Send emails", () => {
  it("should return a 404 'Users not found'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/email/send")
      .send({
        emails: ["foobar"],
        template: defaultTemplate,
      })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(404)
  })
})

// Template not found
describe("Send emails", () => {
  it("should return a 500 'Template not found'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/email/send")
      .send({
        emails: [defaultEmail],
        template: "foobar",
      })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(500)
  })
})

// Template not found
describe("Send emails", () => {
  it("should return a 200 'Emails sent'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/email/send")
      .send({
        emails: [defaultEmail],
        template: defaultTemplate,
      })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(200)
  })
})

// After All
afterAll(async () => {
  // Delete User
  await request(`http://localhost:${process.env.PORT}`)
    .delete(`/api/user/delete/${id}`)
    .set("Cookie", global.authCookies)
})
