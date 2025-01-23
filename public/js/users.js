const lastNameElement = document.querySelector("#addUserLastName")
const firstNameElement = document.querySelector("#addUserFirstName")
const emailElement = document.querySelector("#addUserEmail")
const teamElement = document.querySelector("#addUserTeam")

// User List
const fetchUsers = async () => {
  let userCounterTotal = 1

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
    for (const user of users) {
      const div = document.createElement("div")
      div.classList.add("list-group-item", "align-items-center", "d-flex", "flex-column")

      if (userCounterTotal % 2 === 0) {
        div.classList.add("bg-secondary-subtle")
      }
      userCounterTotal++

      // Fetch Users
      const responseCounter = await fetch(`/api/tracking/count/${user.id}`)
      if (!responseCounter) {
        throw new Error("Failed to fetch counter")
      }
      const counter = await responseCounter.json()

      // Row 1
      const row1 = document.createElement("div")
      row1.classList.add(
        "d-flex",
        "align-items-center",
        "gap-2",
        "justify-content-between",
        "w-100"
      )

      const userName = document.createElement("span")
      userName.classList.add("d-block", "fw-bold")
      userName.innerText = `${user.name_last} ${user.name_first}`

      const deleteButton = document.createElement("button")
      deleteButton.classList.add("btn", "btn-danger", "btn-sm")
      deleteButton.innerText = "Supprimer"
      deleteButton.onclick = () => {
        if (confirm(`Êtes-vous sûr(e) de vouloir supprimer ${user.email}?`)) {
          deleteUser(user.id)
        }
      }

      const border = document.createElement("div")
      border.classList.add("border", "border-bottom", "border-secondary-subtle", "w-75", "mt-2")

      // Row 2
      const row2 = document.createElement("div")
      row2.classList.add(
        "d-flex",
        "align-items-top",
        "gap-2",
        "justify-content-between",
        "mt-1",
        "w-100"
      )

      const userEmailCounter = document.createElement("div")
      userEmailCounter.classList.add("d-flex", "flex-column", "text-start")

      const userMail = document.createElement("small")
      userMail.classList.add("d-block", "text-body-secondary")
      userMail.innerText = user.email

      const userCounter = document.createElement("small")
      userCounter.classList.add("d-block", "text-body-secondary")
      userCounter.innerText = `Total: ${counter.count}`

      const userTeamOU = document.createElement("div")
      userTeamOU.classList.add("d-flex", "flex-column", "text-end")

      const userOU = document.createElement("small")
      userOU.classList.add("d-block", "text-body-secondary")
      userOU.innerText = user.ou

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
const fetchTeams = async () => {
  try {
    // Fetch Teams
    const response = await fetch("/api/users/teams")
    if (!response) {
      throw new Error("Failed to fetch teams")
    }
    const teams = await response.json()

    // Get Team Select
    const teamSelect = document.querySelector("#addUserTeam")

    // Create Team Select Options
    teams.forEach((team) => {
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
fetchTeams()

document.querySelector("#addUserForm").addEventListener("submit", async (event) => {
  event.preventDefault()

  addUser(lastNameElement.value, firstNameElement.value, emailElement.value, teamElement.value)
})

const addUser = async (lastName, firstName, email, team) => {
  const errorText = document.querySelector("#newUserMessage")

  try {
    // POST Request
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lastName, firstName, email, team }),
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
    lastNameElement.value = ""
    firstNameElement.value = ""
    emailElement.value = ""
    teamElement.value = ""
    fetchUsers()

    // Create Message
  } catch (error) {
    console.error("Error adding user:", error)
    errorTextinnerText = "An error occurred while adding the user."
  }
}
