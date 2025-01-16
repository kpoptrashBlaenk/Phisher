document.querySelector("#sendEmailsButton").addEventListener("click", async () => {
  sendEmails()
})

const sendEmails = async () => {
  try {
    // GET Request to send emails
    const response = await fetch("/email")

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
