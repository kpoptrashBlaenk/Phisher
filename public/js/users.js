// Get elements
const lastNameElement = document.querySelector("#addUserLastName")
const firstNameElement = document.querySelector("#addUserFirstName")
const emailElement = document.querySelector("#addUserEmail")
const teamElement = document.querySelector("#addUserTeam")

// User List
async function fetchUsers() {
  // Track user amount for coloring
  let userCounterTotal = 1

  try {
    // Get all users using /users api
    const response = await fetch("/api/users")

    if (!response) {
      throw new Error("Failed to fetch users")
    }

    const users = await response.json()

    // Get users list element and empty it
    const userList = document.querySelector("#usersList")
    userList.innerHTML = ""

    // For each user create user list item
    for (const user of users) {
      // Div
      const div = document.createElement("div")
      div.classList.add("list-group-item", "align-items-center", "d-flex", "flex-column")

      // Every second div is grey
      if (userCounterTotal % 2 === 0) {
        div.classList.add("bg-secondary-subtle")
      }
      userCounterTotal++

      // Get this users counter using /tracking/count:id api
      const responseCounter = await fetch(`/api/tracking/count/${user.id}`)

      if (!responseCounter) {
        throw new Error("Failed to fetch counter")
      }

      const counter = await responseCounter.json()

      // Upper Div
      const row1 = document.createElement("div")
      row1.classList.add("d-flex", "align-items-center", "gap-2", "justify-content-between", "w-100")

      // Span for name
      const userName = document.createElement("span")
      userName.classList.add("d-block", "fw-bold")
      userName.innerText = `${user.name_last} ${user.name_first}`

      // Delete button
      const deleteButton = document.createElement("button")
      deleteButton.classList.add("btn", "btn-danger", "btn-sm")
      deleteButton.innerText = "Supprimer"
      deleteButton.onclick = () => {
        if (confirm(`Êtes-vous sûr(e) de vouloir supprimer ${user.email}?`)) {
          deleteUser(user.id)
        }
      }

      // Border
      const border = document.createElement("div")
      border.classList.add("border", "border-bottom", "border-secondary-subtle", "w-75", "mt-2")

      // Lower Div
      const row2 = document.createElement("div")
      row2.classList.add("d-flex", "align-items-top", "gap-2", "justify-content-between", "mt-1", "w-100")

      // Left Div of lower div
      const userEmailCounter = document.createElement("div")
      userEmailCounter.classList.add("d-flex", "flex-column", "text-start")

      // Small for email
      const userMail = document.createElement("small")
      userMail.classList.add("d-block", "text-body-secondary")
      userMail.innerText = user.email

      // Small for counter
      const userCounter = document.createElement("small")
      userCounter.classList.add("d-block", "text-body-secondary")
      userCounter.innerText = `Total: ${counter.count}`

      // Right Div of lower div
      const userTeamOU = document.createElement("div")
      userTeamOU.classList.add("d-flex", "flex-column", "text-end")

      // Small for ou
      const userOU = document.createElement("small")
      userOU.classList.add("d-block", "text-body-secondary")
      userOU.innerText = user.ou

      // Small for team
      const userTeam = document.createElement("small")
      userTeam.classList.add("d-block", "text-body-secondary")
      userTeam.innerText = user.team

      // Append
      row1.appendChild(userName)
      row1.appendChild(deleteButton)

      userEmailCounter.appendChild(userMail)
      userEmailCounter.appendChild(userCounter)
      userTeamOU.appendChild(userOU)
      userTeamOU.appendChild(userTeam)
      row2.appendChild(userEmailCounter)
      row2.appendChild(userTeamOU)

      div.appendChild(row1)
      div.appendChild(border)
      div.appendChild(row2)
      userList.appendChild(div)
    }
  } catch (error) {
    console.error("Error fetching users:", error)
  }
}

// Delete User
async function deleteUser(userId) {
  try {
    // Delete user using /users:id api
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    })

    if (!response) {
      throw new Error("Failed to delete user")
    }

    // If not ok, error
    if (!response.ok) {
      const result = await response.json()
      alert(result.message || "Failed to delete user")
    }

    fetchUsers()
  } catch (error) {
    console.error("Error deleting user:", error)
  }
}

// Add User
async function fetchTeams() {
  try {
    // Get all teams using /users/teams api
    const response = await fetch("/api/users/teams")

    if (!response) {
      throw new Error("Failed to fetch teams")
    }

    const teams = await response.json()

    // Get team dropdown element
    const teamSelect = document.querySelector("#addUserTeam")

    // For each team create option for dropdown
    teams.forEach((team) => {
      // Option
      const option = document.createElement("option")
      option.value = team.team
      option.innerText = team.team

      // Append
      teamSelect.appendChild(option)
    })
  } catch (error) {
    console.error("Error fetching teams:", error)
  }
}

// Add User Click
document.querySelector("#addUserForm").addEventListener("submit", async (event) => {
  event.preventDefault()

  addUser(lastNameElement.value, firstNameElement.value, emailElement.value, teamElement.value)
})

// Add User
async function addUser(lastName, firstName, email, team) {
  // Get error text element
  const errorText = document.querySelector("#newUserMessage")

  try {
    // Add user using /users api
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lastName, firstName, email, team }),
    })

    const result = await response.json()

    // If not ok, error
    if (!response.ok) {
      errorText.innerText = result.message
      errorText.classList.add("text-danger")
      errorText.classList.remove("text-success")
      return
    }

    // Success
    errorText.innerText = result.message
    errorText.classList.remove("text-danger")
    errorText.classList.add("text-success")
    lastNameElement.value = ""
    firstNameElement.value = ""
    emailElement.value = ""
    teamElement.value = ""
    fetchUsers()
  } catch (error) {
    console.error("Error adding user:", error)
    errorTextinnerText = "An error occurred while adding the user."
  }
}

fetchTeams()
fetchUsers()
