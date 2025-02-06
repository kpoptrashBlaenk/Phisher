const emailsList = document.querySelector("#emailsList")
const emailBreadcrumb = document.querySelector("#emailBreadcrumb")

/*
checks to do:
when ou selected: select all agents of ou
when ou unselected: unselected all agents of ou

when team selected: select all agents of team adn check if all teams of ou selected to then maybe check ou
when team unselected: unselected all agents of team and unselected ou

when agent selected: select agent and check if all agents of team selected to then maybe check team then check the same for ou with team
when agent unselected: unselected agent and unselect team and ou
*/
let allAgents
let allSelectedAgents = []

let currentOU = ""
let currentTeam = ""

// All Users List
async function getAllUsers() {
  try {
    // Fetch users using /users api
    const response = await fetch("/api/users")

    if (!response) {
      throw new Error("Failed to fetch users")
    }

    const users = await response.json()

    const allUsers = {}

    // form of {ou: {team: [email]}}
    users.forEach(({ email, team, ou }) => {
      // Create empty if not exists
      if (!allUsers[ou]) {
        allUsers[ou] = {}
      }

      // Create empty if not exists
      if (!allUsers[ou][team]) {
        allUsers[ou][team] = []
      }

      // Add user list
      allUsers[ou][team].push(email)
    })

    allAgents = allUsers
    showUOs()
  } catch (error) {
    console.error("Error fetching users:", error)
  }
}

// Select or deselct agent
function selectedAgent(agent, selected) {
  // If selected, add agent
  if (selected) {
    allSelectedAgents.push(agent)
    return
  }

  // If not, remove agent
  allSelectedAgents.splice(allSelectedAgents.indexOf(agent), 1)
}

// Select or deselct agents of team
function selectedTeam(team, selected) {
  // If selected, add all agents of team
  if (selected) {
    allAgents[currentOU][team].forEach((agent) => {
      if (!allSelectedAgents.includes(agent)) {
        allSelectedAgents.push(agent)
      }
    })
    return
  }

  // If not, remove all agents of team
  allAgents[currentOU][team].forEach((agent) => {
    if (allSelectedAgents.includes(agent)) {
      allSelectedAgents.splice(allSelectedAgents.indexOf(agent), 1)
    }
  })
}

// Select or deselct agents of ou
function selectedOU(ou, selected) {
  // For each team of ou, select agents of team
  Object.entries(allAgents[ou]).forEach((team) => {
    team = team[0]

    currentOU = ou
    selectedTeam(team, selected)
    currentOU = ""
  })
}

// If agent is selected
function checkAllOfAgent(agent) {
  return allSelectedAgents.includes(agent) ? true : false
}

// If all agents of team are selected
function checkAllOfTeam(team) {
  let allSelected = true

  allAgents[currentOU][team].forEach((agent) => {
    if (!checkAllOfAgent(agent)) {
      allSelected = false
    }
  })

  return allSelected
}

// If all agents of ou are selected
function checkAllOfOU(ou) {
  let allSelected = true
  currentOU = ou

  Object.entries(allAgents[ou]).forEach((team) => {
    team = team[0]

    if (!checkAllOfTeam(team)) {
      allSelected = false
    }
  })

  currentOU = ""
  return allSelected
}

// update Breadcrumb All / OU / Team
function updateBreadcrumb() {
  // Empty breadcrumb
  emailBreadcrumb.innerHTML = ""

  // Li
  const breadcrumbDefaultLi = document.createElement("li")
  breadcrumbDefaultLi.classList.add("breadcrumb-item")

  // All button
  const breadcrumbDefaultButton = document.createElement("button")
  breadcrumbDefaultButton.classList.add("btn", "btn-link", "p-0", "text-decoration-none")
  breadcrumbDefaultButton.textContent = "All"
  breadcrumbDefaultButton.addEventListener("click", () => {
    currentOU = ""
    currentTeam = ""
    showUOs()
  })

  // Append
  breadcrumbDefaultLi.appendChild(breadcrumbDefaultButton)
  emailBreadcrumb.appendChild(breadcrumbDefaultLi)

  // If ou is selected
  if (currentOU.length > 0) {
    // Li
    const breadcrumbOULi = document.createElement("li")
    breadcrumbOULi.classList.add("breadcrumb-item")

    // OU Button
    const breadcrumbOUButton = document.createElement("button")
    breadcrumbOUButton.classList.add("btn", "btn-link", "p-0", "text-decoration-none")
    breadcrumbOUButton.textContent = currentOU
    breadcrumbOUButton.addEventListener("click", () => {
      currentTeam = ""
      showTeams(currentOU)
    })

    // Append
    breadcrumbOULi.appendChild(breadcrumbOUButton)
    emailBreadcrumb.appendChild(breadcrumbOULi)
  }

  // If team is selected
  if (currentTeam.length > 0) {
    // Li
    const breadcrumbTeamLi = document.createElement("li")
    breadcrumbTeamLi.classList.add("breadcrumb-item")

    // Team button
    const breadcrumbTeamButton = document.createElement("button")
    breadcrumbTeamButton.classList.add("btn", "btn-link", "p-0", "text-decoration-none")
    breadcrumbTeamButton.textContent = currentTeam
    breadcrumbTeamButton.addEventListener("click", () => showAgents(currentTeam))

    // Append
    breadcrumbTeamLi.appendChild(breadcrumbTeamButton)
    emailBreadcrumb.appendChild(breadcrumbTeamLi)
  }
}

// Show OUs in List
function showUOs() {
  // Empty list
  emailsList.innerHTML = ""

  // For each ou
  Object.entries(allAgents).forEach((ou) => {
    // Get ou name
    ou = ou[0]

    // Div
    const div = document.createElement("div")
    div.classList.add("d-flex")

    // Checkbox
    const checkbox = document.createElement("input")
    checkbox.classList.add("mx-3")
    checkbox.type = "checkbox"
    checkbox.checked = checkAllOfOU(ou) // Checked if all agents of ou selected
    // Onchange, select or unselect ou
    checkbox.addEventListener("change", (event) => {
      selectedOU(event.target.nextElementSibling.innerText, event.target.checked)
    })

    // Button
    const button = document.createElement("button")
    button.classList.add("list-group-item", "list-group-item-action")
    button.innerText = ou
    // Onclick, show teams of ou
    button.addEventListener("click", () => {
      currentOU = ou
      currentTeam = ""
      showTeams(ou)
    })

    // Append
    div.appendChild(checkbox)
    div.appendChild(button)
    emailsList.appendChild(div)
  })

  updateBreadcrumb()
}

// Show Teams in List
async function showTeams(ou) {
  // Empty list
  emailsList.innerHTML = ""

  // For each team of ou
  Object.entries(allAgents[ou]).forEach((team) => {
    // Get team name
    team = team[0]

    // Team
    const div = document.createElement("div")
    div.classList.add("d-flex")

    // Checkbox
    const checkbox = document.createElement("input")
    checkbox.classList.add("mx-3")
    checkbox.type = "checkbox"
    checkbox.checked = checkAllOfTeam(team) // Checked if all agents of team selected
    // Onchange, select or unselect team
    checkbox.addEventListener("change", (event) => {
      selectedTeam(event.target.nextElementSibling.innerText, event.target.checked)
    })

    // Button
    const button = document.createElement("button")
    button.classList.add("list-group-item", "list-group-item-action")
    button.innerText = team
    // Onclick, show agents of team
    button.addEventListener("click", () => {
      currentTeam = team
      showAgents(team)
    })

    // Append
    div.appendChild(checkbox)
    div.appendChild(button)
    emailsList.appendChild(div)
  })

  updateBreadcrumb()
}

// Show Agents in List
async function showAgents(team) {
  // Empty list
  emailsList.innerHTML = ""

  // For each agent of team
  allAgents[currentOU][team].forEach((agent) => {
    // Div
    const div = document.createElement("div")
    div.classList.add("d-flex")

    // Checkbox
    const checkbox = document.createElement("input")
    checkbox.classList.add("mx-3")
    checkbox.type = "checkbox"
    checkbox.checked = checkAllOfAgent(agent) // Checked if agent selected
    checkbox.addEventListener("change", (event) => {
      selectedAgent(event.target.nextElementSibling.innerText, event.target.checked)
    })

    // Button
    const button = document.createElement("button")
    button.classList.add("list-group-item", "list-group-item-action")
    button.innerText = agent

    // Append
    div.appendChild(checkbox)
    div.appendChild(button)
    emailsList.appendChild(div)
  })

  updateBreadcrumb()
}

// Send Email Button Click
document.querySelector("#sendEmailsButton").addEventListener("click", async () => {
  // Get chosen template
  const selectedTemplate = document.querySelector("#templateList .active button").innerText

  sendEmails(allSelectedAgents, selectedTemplate)
})

// Send Emails
async function sendEmails(emails, template) {
  // Get error text element
  const messageBox = document.querySelector("#sendEmailsMessage")

  try {
    // Send mails using /email api
    const response = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emails, template }),
    })

    const message = await response.text()

    // If not ok, error
    if (!response.ok) {
      messageBox.innerText = message
      messageBox.classList.remove("text-success")
      messageBox.classList.add("text-danger")
      return
    }

    // Success then reset selected agents then show ous
    messageBox.innerText = message
    messageBox.classList.add("text-success")
    messageBox.classList.remove("text-danger")
    allSelectedAgents = []
    showUOs()

    // Error Message
  } catch (error) {
    console.error("Error sending emails")
    messageBox.innerText = "An error occurred while sending the emails."
    messageBox.classList.add("text-danger")
  }
}

// Fill users list
getAllUsers()
