const templateListElement = document.querySelector("#templateList")
const allTemplates = [{ name: "Template 1" }, { name: "Template 2" }]

const createTemplateList = () => {
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
    if (index === 0) {
      div.classList.add("active")
    }

    // Name Button
    const nameButton = document.createElement("button")
    nameButton.classList.add("btn", "w-100", index === 1 ? "btn-light" : "btn-primary")
    nameButton.textContent = template.name

    // Go Button
    const goButton = document.createElement("button")
    goButton.classList.add(
      "btn",
      index === 1 ? "btn-primary" : "btn-light",
      index === 1 ? "text-white" : "text-black"
    )
    goButton.textContent = "Preview"

    // Append
    div.appendChild(nameButton)
    div.appendChild(goButton)
    templateListElement.appendChild(div)
  })
}

createTemplateList()
