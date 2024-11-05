const express = require("express")
const router = express.Router()

router.get("/click", (req, res) => {
  const { userId } = req.query

  if (userId) {
    console.log(`User ${userId} clicked the button!`)
    res.send(
      `<h1>Thank you for clicking!</h1><p>Your action has been recorded.</p>`
    )
  } else {
    res.status(400).send("User ID missing!")
  }
})

module.exports = router
