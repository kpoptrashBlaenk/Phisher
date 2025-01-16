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
    const userList = document.querySelector("#usersList")
    userList.innerHTML = ""

    // Create User List Items
    users.forEach((user) => {
      const label = document.createElement("div")
      label.classList.add(
        "list-group-item",
        "d-flex",
        "align-items-center",
        "gap-2",
        "justify-content-between"
      )

      const smallStart = document.createElement("span")
      smallStart.classList.add("d-block", "text-body-secondary", "fw-bold")
      smallStart.innerText = user.email

      const deleteButton = document.createElement("button")
      deleteButton.classList.add("btn", "btn-danger", "btn-sm")
      deleteButton.innerText = "Supprimer"
      deleteButton.onclick = () => {
        if (confirm(`Êtes-vous sûr(e) de vouloir supprimer ${user.email}?`)) {
          deleteUser(user.id)
        }
      }

      // Append
      label.appendChild(smallStart)
      label.appendChild(deleteButton)
      userList.appendChild(label)
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
document.querySelector("#addUserForm").addEventListener("submit", async (event) => {
  event.preventDefault()

  // Get Values
  const email = document.querySelector("#addUserEmail").value

  addUser(email)
})

const addUser = async (email) => {
  const errorText = document.querySelector("#newUserMessage")

  try {
    // POST Request
    const response = await fetch("/api/users", {
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
    errorTextinnerText = "An error occurred while adding the user."
  }
}
