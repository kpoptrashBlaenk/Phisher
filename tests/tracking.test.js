const request = require("supertest")
const dotenv = require("dotenv")

dotenv.config()

const defaultEmail = "foo@bar.com"
const defaultTeam = "DIRECTION EIC LORCA"

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

// ##### /TRACKING/GET #####

// Success
describe("Get all tracking logs", () => {
  it("should return a json with all the tracking logs", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .get("/api/tracking/get")
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(200)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Array)

    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("id")
      expect(res.body[0]).toHaveProperty("user_id")
      expect(res.body[0]).toHaveProperty("timestamp")
      expect(res.body[0]).toHaveProperty("page")
      expect(res.body[0]).toHaveProperty("message")
      expect(res.body[0]).toHaveProperty("count")
    }
  })
})

// ##### /TRACKING/COUNT/:ID #####

// Success
describe("Get tracking log count of user", () => {
  it("should return a json with the tracking logs count", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .get(`/api/tracking/count/${id}`)
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(200)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("count")
  })
})

// ##### /:PAGE/:MESSAGE/:ID #####

// Success
describe("Add tracking log", () => {
  it("should return 401 redirection", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .get(`/api/tracking/foo/bar/${id}`)
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(401)
  })
})

// After All
afterAll(async () => {
  // Delete User
  await request(`http://localhost:${process.env.PORT}`)
    .delete(`/api/user/delete/${id}`)
    .set("Cookie", global.authCookies)
})
