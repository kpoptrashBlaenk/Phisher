const emailsList = document.querySelector("#emailsList")
const emailBreadcrumb = document.querySelector("#emailBreadcrumb")

let allAgents
let allSelectedAgents = []
/*
checks to do:
when ou selected: select all agents of ou
when ou unselected: unselected all agents of ou

when team selected: select all agents of team adn check if all teams of ou selected to then maybe check ou
when team unselected: unselected all agents of team and unselected ou

when agent selected: select agent and check if all agents of team selected to then maybe check team then check the same for ou with team
when agent unselected: unselected agent and unselect team and ou
*/
let currentOU = ""
let currentTeam = ""

const getAllUsers = async () => {
  try {
    // Fetch Users
    const response = await fetch("/api/users")
    if (!response) {
      throw new Error("Failed to fetch users")
    }

    const users = await response.json()
    const allUsers = {}

    // form of {ou: {team: [email]}}
    users.forEach(({ email, team, ou }) => {
      if (!allUsers[ou]) {
        allUsers[ou] = {}
      }

      if (!allUsers[ou][team]) {
        allUsers[ou][team] = []
      }

      allUsers[ou][team].push(email)
    })

    allAgents = allUsers
    showUOs()
  } catch (error) {
    console.error("Error fetching users:", error)
  }
}

const selectedAgent = (agent, selected) => {
  if (selected) {
    allSelectedAgents.push(agent)
    return
  }

  allSelectedAgents.splice(allSelectedAgents.indexOf(agent), 1)
}

const selectedTeam = (team, selected) => {
  if (selected) {
    allAgents[currentOU][team].forEach((agent) => {
      if (!allSelectedAgents.includes(agent)) {
        allSelectedAgents.push(agent)
      }
    })
    return
  }

  allAgents[currentOU][team].forEach((agent) => {
    if (allSelectedAgents.includes(agent)) {
      allSelectedAgents.splice(allSelectedAgents.indexOf(agent), 1)
    }
  })
}

const selectedOU = (ou, selected) => {
  Object.entries(allAgents[ou]).forEach((team) => {
    team = team[0]

    currentOU = ou
    selectedTeam(team, selected)
    currentOU = ""
  })
}

const checkAllOfAgent = (agent) => {
  return allSelectedAgents.includes(agent) ? true : false
}

const checkAllOfTeam = (team) => {
  let allSelected = true

  allAgents[currentOU][team].forEach((agent) => {
    if (!checkAllOfAgent(agent)) {
      allSelected = false
    }
  })

  return allSelected
}

const checkAllOfOU = (ou) => {
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

const updateBreadcrumb = () => {
  emailBreadcrumb.innerHTML = ""

  const breadcrumbDefaultLi = document.createElement("li")
  breadcrumbDefaultLi.classList.add("breadcrumb-item")

  const breadcrumbDefaultButton = document.createElement("button")
  breadcrumbDefaultButton.classList.add("btn", "btn-link", "p-0", "text-decoration-none")
  breadcrumbDefaultButton.textContent = "All"
  breadcrumbDefaultButton.addEventListener("click", () => {
    currentOU = ""
    currentTeam = ""
    showUOs()
  })

  breadcrumbDefaultLi.appendChild(breadcrumbDefaultButton)
  emailBreadcrumb.appendChild(breadcrumbDefaultLi)

  if (currentOU.length > 0) {
    const breadcrumbOULi = document.createElement("li")
    breadcrumbOULi.classList.add("breadcrumb-item")

    const breadcrumbOUButton = document.createElement("button")
    breadcrumbOUButton.classList.add("btn", "btn-link", "p-0", "text-decoration-none")
    breadcrumbOUButton.textContent = currentOU
    breadcrumbOUButton.addEventListener("click", () => {
      currentTeam = ""
      showTeams(currentOU)
    })

    breadcrumbOULi.appendChild(breadcrumbOUButton)
    emailBreadcrumb.appendChild(breadcrumbOULi)
  }

  if (currentTeam.length > 0) {
    const breadcrumbTeamLi = document.createElement("li")
    breadcrumbTeamLi.classList.add("breadcrumb-item")

    const breadcrumbTeamButton = document.createElement("button")
    breadcrumbTeamButton.classList.add("btn", "btn-link", "p-0", "text-decoration-none")
    breadcrumbTeamButton.textContent = currentTeam
    breadcrumbTeamButton.addEventListener("click", () => showAgents(currentTeam))

    breadcrumbTeamLi.appendChild(breadcrumbTeamButton)
    emailBreadcrumb.appendChild(breadcrumbTeamLi)
  }
}

const showUOs = () => {
  emailsList.innerHTML = ""

  Object.entries(allAgents).forEach((ou) => {
    ou = ou[0]
    const div = document.createElement("div")
    div.classList.add("d-flex")

    const checkbox = document.createElement("input")
    checkbox.classList.add("mx-3")
    checkbox.type = "checkbox"
    checkbox.checked = checkAllOfOU(ou)
    checkbox.addEventListener("change", (event) => {
      selectedOU(event.target.nextElementSibling.innerText, event.target.checked)
    })

    const button = document.createElement("button")
    button.classList.add("list-group-item", "list-group-item-action")
    button.innerText = ou
    button.addEventListener("click", () => {
      currentOU = ou
      currentTeam = ""
      showTeams(ou)
    })

    div.appendChild(checkbox)
    div.appendChild(button)
    emailsList.appendChild(div)
  })

  updateBreadcrumb()
}

const showTeams = (ou) => {
  emailsList.innerHTML = ""

  Object.entries(allAgents[ou]).forEach((team) => {
    team = team[0]

    const div = document.createElement("div")
    div.classList.add("d-flex")

    const checkbox = document.createElement("input")
    checkbox.classList.add("mx-3")
    checkbox.type = "checkbox"
    checkbox.checked = checkAllOfTeam(team)
    checkbox.addEventListener("change", (event) => {
      selectedTeam(event.target.nextElementSibling.innerText, event.target.checked)
    })

    const button = document.createElement("button")
    button.classList.add("list-group-item", "list-group-item-action")
    button.innerText = team
    button.addEventListener("click", () => {
      currentTeam = team
      showAgents(team)
    })

    div.appendChild(checkbox)
    div.appendChild(button)
    emailsList.appendChild(div)
  })

  updateBreadcrumb()
}

const showAgents = (team) => {
  emailsList.innerHTML = ""
  allAgents[currentOU][team].forEach((agent) => {
    const div = document.createElement("div")
    div.classList.add("d-flex")

    const checkbox = document.createElement("input")
    checkbox.classList.add("mx-3")
    checkbox.type = "checkbox"
    checkbox.checked = checkAllOfAgent(agent)
    checkbox.addEventListener("change", (event) => {
      selectedAgent(event.target.nextElementSibling.innerText, event.target.checked)
    })

    const button = document.createElement("button")
    button.classList.add("list-group-item", "list-group-item-action")
    button.innerText = agent

    div.appendChild(checkbox)
    div.appendChild(button)
    emailsList.appendChild(div)
  })

  updateBreadcrumb()
}

getAllUsers()

document.querySelector("#sendEmailsButton").addEventListener("click", async () => {
  console.log(allSelectedAgents)

  sendEmails(allSelectedAgents)
})

const sendEmails = async (emails) => {
  try {
    // GET Request to send emails
    const response = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emails }),
    })

    const message = await response.text()
    // If response => Message
    const messageBox = document.querySelector("#sendEmailsMessage")
    if (response.ok) {
      console.log("Emails sent")
      messageBox.innerText = message
      messageBox.classList.add("text-success")
      messageBox.classList.remove("text-danger")

      allSelectedAgents = []
      showUOs()
    } else {
      console.error("Error sending emails:", message)
      messageBox.innerText = `Failed to send some emails: ${message}`
      messageBox.classList.remove("text-success")
      messageBox.classList.add("text-danger")
    }

    // Error Message
  } catch (error) {
    console.error("Error sending emails:", error)
    messageBox.innerText = "An error occurred while sending the emails."
    messageBox.classList.add("text-danger")
  }
}
