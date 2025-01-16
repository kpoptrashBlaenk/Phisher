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
      label.classList.add("list-group-item", "d-flex", "align-items-center", "gap-2")

      const spanStart = document.createElement("span")
      spanStart.innerText = user.name
      const smallStart = document.createElement("small")
      smallStart.classList.add("d-block", "text-body-secondary")
      smallStart.innerText = user.email

      const spanEnd = document.createElement("span")
      spanEnd.classList.add("ms-auto", "text-end")
      spanEnd.innerText = "UO"
      const smallEnd = document.createElement("small")
      smallEnd.classList.add("d-block", "text-body-secondary")
      smallEnd.innerText = "Équipe"

      const deleteButton = document.createElement("button")
      deleteButton.classList.add("btn", "btn-danger", "btn-sm")
      deleteButton.innerText = "Supprimer"
      deleteButton.onclick = () => {
        if (confirm(`Êtes-vous sûr(e) de vouloir supprimer ${user.name}?`)) {
          deleteUser(user.id)
        }
      }

      // Append
      spanStart.appendChild(smallStart)
      spanEnd.appendChild(smallEnd)
      label.appendChild(spanStart)
      label.appendChild(spanEnd)
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
  const nameF = document.querySelector("#addUserFirstName").value
  const nameL = document.querySelector("#addUserLastName").value
  const email = document.querySelector("#addUserEmail").value

  addUser(`${nameF} ${nameL}`, email)
})

const addUser = async (name, email) => {
  try {
    // POST Request
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    })

    // If response => Fetch Users
    if (response.ok) {
      console.log("User added")
      fetchUsers()
    } else {
      const result = await response.json()
      document.querySelector("#newUserMessage").innerText = result.message || "Failed to add user"
    }

    // Create Message
  } catch (error) {
    console.error("Error adding user:", error)
    document.querySelector("#newUserMessage").innerText = "An error occurred while adding the user."
  }
}
