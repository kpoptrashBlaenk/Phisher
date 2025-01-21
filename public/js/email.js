document.querySelector("#sendEmailsButton").addEventListener("click", async () => {
  const usersList = document.querySelector("#usersList")
  const checkedInputs = usersList.querySelectorAll('input[type="checkbox"]:checked')

  let emails = []
  checkedInputs.forEach((input) => {
    emails.push(input.nextElementSibling.innerText)
  })

  sendEmails(emails)
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
