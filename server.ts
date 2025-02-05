import dotenv from "dotenv"
import app from "./app"

dotenv.config()

const PORT = process.env.PORT || 3000

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.HOST || `http://localhost:${PORT}`}`)
})
