const request = require("supertest")
const dotenv = require("dotenv")

dotenv.config()

const defaultEmail = "foo@bar.com"
const defaultTeam = "DIRECTION EIC LORCA"
let addedId

console.log(global.authCookies)

// ##### /USER/GET #####

// Success
describe("Get all users", () => {
  it("should return a json with all the users", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .get("/api/user/get")
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(200)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Array)

    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("id")
      expect(res.body[0]).toHaveProperty("email")
      expect(res.body[0]).toHaveProperty("name_first")
      expect(res.body[0]).toHaveProperty("name_last")
      expect(res.body[0]).toHaveProperty("team_id")
    }
  })
})

// ##### /USER/ADD #####

// No last name
describe("Add user", () => {
  it("should return error 422 'Last name is required'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/user/add")
      .send({
        firstName: "foo",
        email: defaultEmail,
        team: defaultTeam,
      })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(422)
  })
})

// No first name
describe("Add user", () => {
  it("should return error 422 'First name is required'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/user/add")
      .send({
        lastName: "bar",
        email: defaultEmail,
        team: defaultTeam,
      })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(422)
  })
})

// No email
describe("Add user", () => {
  it("should return error 422 'Email is required'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/user/add")
      .send({
        lastName: "bar",
        firstName: "foo",
        team: defaultTeam,
      })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(422)
  })
})

// No team
describe("Add user", () => {
  it("should return error 422 'team is required'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/user/add")
      .send({
        lastName: "bar",
        firstName: "foo",
        email: defaultEmail,
      })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(422)
  })
})

// Wrong email format
describe("Add user", () => {
  it("should return error 422 'Invalid email format'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/user/add")
      .send({
        lastName: "bar",
        firstName: "foo",
        email: "foobar",
        team: defaultTeam,
      })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(422)
  })
})

// Team not found
describe("Add user", () => {
  it("should return error 404 'Team not found'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/user/add")
      .send({
        lastName: "bar",
        firstName: "foo",
        email: defaultEmail,
        team: "foobar",
      })
      .set("Cookie", global.authCookies)

    expect(res.body).toBe("Team not found.")
    expect(res.statusCode).toBe(404)
  })
})

// Success
describe("Add user", () => {
  it("should return 201 'User successfully added'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/user/add")
      .send({
        lastName: "bar",
        firstName: "foo",
        email: defaultEmail,
        team: defaultTeam,
      })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(201)
  })
})

// Already exists
describe("Add user", () => {
  it("should return error 409 'User already exists'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/user/add")
      .send({
        lastName: "bar",
        firstName: "foo",
        email: defaultEmail,
        team: defaultTeam,
      })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(409)
  })
})

// ##### /USER/FIND #####

// No email
describe("Find user", () => {
  it("should return error 422 'Email is required'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/user/find")
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(422)
  })
})

// Not found
describe("Find user", () => {
  it("should return error 404 'User not found'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/user/find")
      .send({ email: "foobar" })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(404)
  })
})

// Success
describe("Find user", () => {
  it("should return the user as object", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/user/find")
      .send({ email: defaultEmail })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(200)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("id")
    expect(res.body).toHaveProperty("email")
    expect(res.body).toHaveProperty("name_first")
    expect(res.body).toHaveProperty("name_last")
    expect(res.body).toHaveProperty("team_id")

    addedId = res.body.id
  })
})

// ##### /USER/DELETE/:ID #####

// Wrong id
describe("Delete user", () => {
  it("should return 404 'User not found'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .delete(`/api/user/delete/0`)
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(404)
  })
})

// Success
describe("Delete user", () => {
  it("should return 200 'User deleted successfully'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .delete(`/api/user/delete/${addedId}`)
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(200)
  })
})
