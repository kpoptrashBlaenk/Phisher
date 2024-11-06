// User List
const fetchUsers = async () => {
  try {
    // Fetch Users
    const response = await fetch("/api/users")
    if (!response) {
      throw new Error("Failed to fetch users")
    }
    const users = await response.json()

    // Get User List
    const userList = document.getElementById("userList")
    userList.innerHTML = ""

    // Create User List Items
    users.forEach((user) => {
      // Create Item
      const listItem = document.createElement("li")
      listItem.textContent = `${user.name} (${user.email})`

      // Create Delete Button
      const deleteButton = document.createElement("button")
      deleteButton.textContent = "Delete"
      deleteButton.onclick = () => deleteUser(user.id)

      // Append
      listItem.appendChild(deleteButton)
      userList.appendChild(listItem)
    })
  } catch (error) {
    console.error("Error fetching users:", error)
  }
}
fetchUsers()

// Delete User
const deleteUser = async (userId) => {
  try {
    // DELETE Request
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    })

    // If response => Fetch Users
    if (response.ok) {
      console.log("User deleted")
      fetchUsers()
    } else {
      const result = await response.json()
      alert(result.message || "Failed to delete user")
    }
  } catch (error) {
    console.error("Error deleting user:", error)
  }
}

// Add User
document
  .getElementById("userForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault()

    // Get Values
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value

    try {
      // POST Request
      const response = await fetch("/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      })
      const result = await response.json()

      // Create Message
      document.getElementById("message").textContent =
        result.message || result.error
    } catch (error) {
      console.error("Error adding user:", error)
      document.getElementById("message").textContent =
        "An error occurred while adding the user."
    }
  })
