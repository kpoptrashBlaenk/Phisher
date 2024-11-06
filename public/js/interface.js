document
  .getElementById("userForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault()
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value

    try {
      const response = await fetch("/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      })

      const result = await response.json()
      document.getElementById("message").textContent =
        result.message || result.error
    } catch (error) {
      console.error("Error adding user:", error)
      document.getElementById("message").textContent =
        "An error occurred while adding the user."
    }
  })
