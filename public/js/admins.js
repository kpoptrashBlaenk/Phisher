// Admin List
async function fetchAdmins() {
  try {
    // Fetch admins using /admins api
    const response = await fetch("/api/admins")

    if (!response) {
      throw new Error("Failed to fetch admins")
    }

    const admins = await response.json()

    // Get lsit element
    const adminList = document.querySelector("#adminsList")
    adminList.innerHTML = ""

    // Create admin list items
    admins.forEach((admin) => {
      // Div
      const div = document.createElement("div")
      div.classList.add("list-group-item", "d-flex", "align-items-center", "gap-2", "justify-content-between")

      // Span for email
      const adminMail = document.createElement("span")
      adminMail.classList.add("d-block", "text-body-secondary", "fw-bold")
      adminMail.innerText = admin.email

      // Delete button
      const deleteButton = document.createElement("button")
      deleteButton.classList.add("btn", "btn-danger", "btn-sm")
      deleteButton.innerText = "Supprimer"
      deleteButton.onclick = () => {
        if (confirm(`Êtes-vous sûr(e) de vouloir supprimer ${admin.email}?`)) {
          deleteAdmin(admin.id)
        }
      }

      // Append
      div.appendChild(adminMail)
      div.appendChild(deleteButton)
      adminList.appendChild(div)
    })
  } catch (error) {
    console.error("Error fetching admins:", error)
  }
}

// Add Admin Button Click
document.querySelector("#addAdminForm").addEventListener("submit", async (event) => {
  event.preventDefault()

  // Get values
  const email = document.querySelector("#addAdminEmail").value

  addAdmin(email)
})

// Add Admin
async function addAdmin(email) {
  // Get error text element
  const errorText = document.querySelector("#newAdminMessage")

  try {
    // Add admin using /admins api
    const response = await fetch("/api/admins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const result = await response.json()

    // If not ok, error
    if (!response.ok) {
      errorText.innerText = result.message
      errorText.classList.add("text-danger")
      errorText.classList.remove("text-success")
      return
    }

    // Success and fetch again
    errorText.innerText = result.message
    errorText.classList.remove("text-danger")
    errorText.classList.add("text-success")
    document.querySelector("#addAdminEmail").value = ""
    fetchAdmins()
  } catch (error) {
    console.error("Error adding admin:", error)
    errorTextinnerText = "An error occurred while adding the admin."
  }
}

// Delete Admin
async function deleteAdmin(adminId) {
  try {
    // Delete admin using /admins:id api
    const response = await fetch(`/api/admins/${adminId}`, {
      method: "DELETE",
    })

    // If not ok, error
    if (!response.ok) {
      const result = await response.json()
      alert(result.message || "Failed to delete admin")
    }

    fetchAdmins()
  } catch (error) {
    console.error("Error deleting admin:", error)
  }
}

// Fill admin list
fetchAdmins()
