// Admin List
const fetchAdmins = async () => {
  try {
    // Fetch Admins
    const response = await fetch("/api/admins")
    if (!response) {
      throw new Error("Failed to fetch admins")
    }
    const admins = await response.json()

    // Get Admins List
    const adminList = document.querySelector("#adminsList")
    adminList.innerHTML = ""

    // Create Admin List Items
    admins.forEach((admin) => {
      const div = document.createElement("div")
      div.classList.add(
        "list-group-item",
        "d-flex",
        "align-items-center",
        "gap-2",
        "justify-content-between"
      )

      const adminMail = document.createElement("span")
      adminMail.classList.add("d-block", "text-body-secondary", "fw-bold")
      adminMail.innerText = admin.email

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
fetchAdmins()

// Add Admin
document.querySelector("#addAdminForm").addEventListener("submit", async (event) => {
  event.preventDefault()

  // Get Values
  const email = document.querySelector("#addAdminEmail").value

  addAdmin(email)
})

const addAdmin = async (email) => {
  const errorText = document.querySelector("#newAdminMessage")

  try {
    // POST Request
    const response = await fetch("/api/admins", {
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
    document.querySelector("#addAdminEmail").value = ""
    fetchAdmins()

    // Create Message
  } catch (error) {
    console.error("Error adding admin:", error)
    errorTextinnerText = "An error occurred while adding the admin."
  }
}

// Delete Admin
const deleteAdmin = async (adminId) => {
  try {
    // DELETE Request
    const response = await fetch(`/api/admins/${adminId}`, {
      method: "DELETE",
    })

    // If response => Fetch Admins
    if (response.ok) {
      console.log("Admin deleted")
      fetchAdmins()
    } else {
      const result = await response.json()
      alert(result.message || "Failed to delete admin")
    }
  } catch (error) {
    console.error("Error deleting admin:", error)
  }
}
