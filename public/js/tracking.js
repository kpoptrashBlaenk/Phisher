// Tracking Log List
const fetchLogs = async () => {
  try {
    // Fetch tracking logs
    const response = await fetch("/api/tracking")
    if (!response) {
      throw new Error("Failed to fetch tracking logs")
    }
    const logs = await response.json()

    // Get tracking log list
    const trackList = document.getElementById("trackingLog")
    trackList.innerHTML = ""

    // Create tracking log list items
    logs.forEach((log) => {
      // Format Date
      const date = new Date(log.timestamp)
      const formattedDate = date.toLocaleString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })

      // Create Item
      const listItem = document.createElement("li")
      listItem.textContent = `${log.name} (${log.email}) (${formattedDate})`

      // Append
      trackList.appendChild(listItem)
    })
  } catch (error) {
    console.error("Error fetching tracking log:", error)
  }
}
fetchLogs()
