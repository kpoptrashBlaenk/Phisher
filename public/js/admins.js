// Add Admin
document.querySelector("#addAdminForm").addEventListener("submit", async (event) => {
  event.preventDefault()

  // Get Values
  const email = document.querySelector("#addAdminEmail").value

  addAdmin(email)
})

const addAdmin = async (email) => {
  const errorText = document.querySelector("#newAdminMessage")

  try {
    // POST Request
    const response = await fetch("/api/admins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.log(result.message)
      errorText.innerText = result.message
      errorText.classList.add("text-danger")
      errorText.classList.remove("text-success")
      return
    }

    errorText.innerText = result.message
    errorText.classList.remove("text-danger")
    errorText.classList.add("text-success")
    fetchUsers()

    // Create Message
  } catch (error) {
    console.error("Error adding user:", error)
    errorTextinnerText = "An error occurred while adding the admin."
  }
}
