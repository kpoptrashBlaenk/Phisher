const express = require("express")
const emailRoutes = require("./routes/email-routes")
const trackingRoutes = require("./routes/tracking-routes")
const interfaceRoutes = require("./routes/interface-routes")
const apiRoutes = require("./routes/api/api-routes")

const app = express()

app.use(express.json()) // To use JSON
app.use(express.static("public")) // To use static files from public

app.use("/email", emailRoutes)
app.use("/track", trackingRoutes)
app.use("/", interfaceRoutes)
app.use("/api", apiRoutes)

module.exports = app
