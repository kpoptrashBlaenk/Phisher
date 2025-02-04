const templateListElement = document.querySelector("#templateList")
const allTemplates = [
  { name: "Password Reset", url: "password" },
  { name: "Job Proposition", url: "job-proposition" },
]

const changeSelectedTemplate = (parentDiv) => {
  const allDivs = document.querySelectorAll("#templateList .list-group-item")

  // Set all divs to unselected
  allDivs.forEach((div) => {
    const buttons = div.querySelectorAll("button")
    const nameButton = buttons[0]
    const goButton = buttons[1]

    div.classList.remove("active")
    nameButton.classList.remove("btn-primary")
    nameButton.classList.add("btn-light")
    goButton.classList.remove("btn-light")
    goButton.classList.add("btn-primary")
  })

  // Set selected div to active
  const buttons = parentDiv.querySelectorAll("button")
  const nameButton = buttons[0]
  const goButton = buttons[1]

  parentDiv.classList.add("active")
  nameButton.classList.add("btn-primary")
  nameButton.classList.remove("btn-light")
  goButton.classList.add("btn-light")
  goButton.classList.add("btn-primary")
}

const createTemplateList = () => {
  let defaultSelected

  allTemplates.forEach((template, index) => {
    // Parent Div
    const div = document.createElement("div")
    div.classList.add(
      "list-group-item",
      "list-group-item-action",
      "d-flex",
      "justify-content-between",
      "p-1"
    )

    // Name Button
    const nameButton = document.createElement("button")
    nameButton.classList.add("btn", "w-100")
    nameButton.textContent = template.name
    nameButton.addEventListener("click", () => changeSelectedTemplate(div))

    // Go Button
    const goButton = document.createElement("button")
    goButton.classList.add("btn")
    goButton.textContent = "Preview"
    goButton.addEventListener("click", () => {
      window.open(`/template/${template.url}`, "_blank").focus()
    })

    // Append
    div.appendChild(nameButton)
    div.appendChild(goButton)
    templateListElement.appendChild(div)

    if (index === 0) {
      defaultSelected = div
    }
  })

  changeSelectedTemplate(defaultSelected)
}

createTemplateList()
