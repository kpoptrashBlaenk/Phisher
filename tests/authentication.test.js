const request = require("supertest")
const dotenv = require("dotenv")

dotenv.config()

const defaultEmail = "foo@bar.com"
const defaultPassword = "FooBar123!"
let id

console.log(global.authCookies)

// Before All
beforeAll(async () => {
  // Add Admin
  await request(`http://localhost:${process.env.PORT}`)
    .post("/api/admin/add")
    .send({
      email: defaultEmail,
    })
    .set("Cookie", global.authCookies)

  // Find Admin
  const findUserRes = await request(`http://localhost:${process.env.PORT}`)
    .post("/api/admin/find")
    .send({ email: defaultEmail })
    .set("Cookie", global.authCookies)

  // Save User
  id = findUserRes.body.id
})

// ##### /AUTHENTICATION/REGISTER #####

// No email and password
describe("Register", () => {
  it("should return a 422 'Email and Password are required'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`).post("/api/authentication/register")

    expect(res.statusCode).toBe(422)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("context")
    expect(res.body).toHaveProperty("message")
  })
})

// No email
describe("Register", () => {
  it("should return a 422 'Email is required'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`).post("/api/authentication/register").send({
      password: defaultPassword,
    })

    expect(res.statusCode).toBe(422)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("context")
    expect(res.body).toHaveProperty("message")
  })
})

// Wrong email format
describe("Register", () => {
  it("should return a 422 'Wrong email format'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`).post("/api/authentication/register").send({
      email: "foobar",
      password: defaultPassword,
    })

    expect(res.statusCode).toBe(422)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("context")
    expect(res.body).toHaveProperty("message")
  })
})

// No password
describe("Register", () => {
  it("should return a 422 'Password is required'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`).post("/api/authentication/register").send({
      email: defaultEmail,
    })

    expect(res.statusCode).toBe(422)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("context")
    expect(res.body).toHaveProperty("message")
  })
})

// Invalid password
describe("Register", () => {
  it("should return a 422 'Password is invalid'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`).post("/api/authentication/register").send({
      email: defaultEmail,
      password: "foobar",
    })

    expect(res.statusCode).toBe(422)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("context")
    expect(res.body).toHaveProperty("message")
  })
})

// No access
describe("Register", () => {
  it("should return a 403 'No access'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`).post("/api/authentication/register").send({
      email: "foo@bar.cum",
      password: defaultPassword,
    })

    expect(res.statusCode).toBe(403)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("context")
    expect(res.body).toHaveProperty("message")
  })
})

// Success
describe("Register", () => {
  it("should return a 200 'Admin added successfully'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`).post("/api/authentication/register").send({
      email: defaultEmail,
      password: defaultPassword,
    })

    expect(res.statusCode).toBe(200)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("context")
    expect(res.body).toHaveProperty("message")
  })
})

// ##### /AUTHENTICATION/LOGIN #####

// No email
describe("Login", () => {
  it("should return a 422 'No email provided'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`).post("/api/authentication/login").send({
      email: defaultEmail,
    })

    expect(res.statusCode).toBe(422)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("context")
    expect(res.body).toHaveProperty("message")
  })
})

// No password
describe("Login", () => {
  it("should return a 422 'No password provided'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`).post("/api/authentication/login").send({
      password: defaultPassword,
    })

    expect(res.statusCode).toBe(422)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("context")
    expect(res.body).toHaveProperty("message")
  })
})

// Not found
describe("Login", () => {
  it("should return a 404 'User not found'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`).post("/api/authentication/login").send({
      email: "foobarfoobarfoobar",
      password: defaultPassword,
    })

    expect(res.statusCode).toBe(404)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("context")
    expect(res.body).toHaveProperty("message")
  })
})

// Wrong password
describe("Login", () => {
  it("should return a 400 'Wrong password'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`).post("/api/authentication/login").send({
      email: defaultEmail,
      password: "foobar",
    })

    expect(res.statusCode).toBe(400)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("context")
    expect(res.body).toHaveProperty("message")
  })
})

// Success
describe("Login", () => {
  it("should return a 200 'Logged in successfully'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`).post("/api/authentication/login").send({
      email: defaultEmail,
      password: defaultPassword,
    })

    expect(res.statusCode).toBe(200)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("redirect")
  })
})

// Already exists
describe("Register", () => {
  it("should return a 409 'Admin already exists'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`).post("/api/authentication/register").send({
      email: defaultEmail,
      password: defaultPassword,
    })

    expect(res.statusCode).toBe(409)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("context")
    expect(res.body).toHaveProperty("message")
  })
})

// After All
afterAll(async () => {
  // Delete Admin
  await request(`http://localhost:${process.env.PORT}`)
    .delete(`/api/admin/delete/${id}`)
    .set("Cookie", global.authCookies)
})
