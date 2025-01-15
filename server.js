require("dotenv").config()
const app = require("./app")

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.HOST || `http://localhost:${PORT}`}`)
})
