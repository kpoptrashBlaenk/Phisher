const request = require("supertest")
const dotenv = require("dotenv")

dotenv.config()

const defaultEmail = "foo@bar.com"
let addedId

// ##### /ADMIN/GET #####

console.log(global.authCookies)

// Success
describe("Get all admins", () => {
  it("should return a json with all the admins", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .get("/api/admin/get")
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(200)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Array)

    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("id")
      expect(res.body[0]).toHaveProperty("email")
      expect(res.body[0]).toHaveProperty("password")
      expect(res.body[0]).toHaveProperty("cookies")
    }
  })
})

// ##### /ADMIN/ADD #####

// No email
describe("Add admin", () => {
  it("should return error 422 'Email is required'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/admin/add")
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(422)
  })
})

// Wrong email format
describe("Add admin", () => {
  it("should return error 422 'Invalid email format'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/admin/add")
      .send({ email: "foobar" })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(422)
  })
})

// Success
describe("Add admin", () => {
  it("should return 201 'Admin successfully added'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/admin/add")
      .send({ email: defaultEmail })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(201)
  })
})

// Already exists
describe("Add admin", () => {
  it("should return error 409 'Admin already exists'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/admin/add")
      .send({ email: defaultEmail })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(409)
  })
})

// ##### /ADMIN/FIND #####

// No email
describe("Find admin", () => {
  it("should return error 422 'Email is required'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/admin/find")
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(422)
  })
})

// Not found
describe("Find admin", () => {
  it("should return error 404 'Admin not found'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/admin/find")
      .send({ email: "foobar" })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(404)
  })
})

// Success
describe("Find admin", () => {
  it("should return the admin as object", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .post("/api/admin/find")
      .send({ email: defaultEmail })
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(200)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Object)

    expect(res.body).toHaveProperty("id")
    expect(res.body).toHaveProperty("email")
    expect(res.body).toHaveProperty("password")
    expect(res.body).toHaveProperty("cookies")

    addedId = res.body.id
  })
})

// ##### /ADMIN/DELETE/:ID #####

// Wrong id
describe("Delete admin", () => {
  it("should return 404 'Admin not found'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .delete(`/api/admin/delete/0`)
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(404)
  })
})

// Success
describe("Delete admin", () => {
  it("should return 200 'Admin deleted successfully'", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .delete(`/api/admin/delete/${addedId}`)
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(200)
  })
})
