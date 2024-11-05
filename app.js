const express = require("express")
const emailRoutes = require("./routes/email-routes")
const trackingRoutes = require("./routes/tracking-routes")

const app = express()

app.use("/email", emailRoutes)
app.use("/track", trackingRoutes)

module.exports = app
