const request = require("supertest")

console.log(global.authCookies)

describe("Get all teams", () => {
  it("should return a json with all the teams", async () => {
    const res = await request(`http://localhost:${process.env.PORT}`)
      .get("/api/team/get")
      .set("Cookie", global.authCookies)

    expect(res.statusCode).toBe(200)
    expect(res.headers["content-type"]).toMatch(/json/)
    expect(res.body).toBeInstanceOf(Array)

    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("id")
      expect(res.body[0]).toHaveProperty("ou_id")
      expect(res.body[0]).toHaveProperty("team")
    }
  })
})
