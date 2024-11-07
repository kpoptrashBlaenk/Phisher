document.getElementById("sendEmails").addEventListener("click", async () => {
  sendEmails()
})

const sendEmails = async () => {
  try {
    // GET Request to send emails
    const response = await fetch("/email")

    const message = await response.text()
    // If response => Message
    if (response.ok) {
      console.log("Emails sent")
      document.getElementById("sendEmailResponse").textContent = message
    } else {
      console.error("Error sending emails:", message)
      document.getElementById(
        "sendEmailResponse"
      ).textContent = `Failed to send some emails: ${message}`
    }

    // Error Message
  } catch (error) {
    console.error("Error sending emails:", error)
    document.getElementById("sendEmailResponse").textContent =
      "An error occurred while sending the emails."
  }
}
