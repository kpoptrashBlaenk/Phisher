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
    const trackList = document.querySelector("#trackingLogList")
    trackList.innerHTML = ""

    // Create tracking log list items
    logs.forEach(async (log) => {
      // Format Date
      const date = new Date(log.timestamp)
      const formattedDate = date.toLocaleString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })

      const response = await fetch(`/api/tracking/count/${log.user_id}`)
      const result = await response.json()
      const counter = result.count

      // Create Item
      const label = document.createElement("label")
      label.classList.add("list-group-item", "d-flex", "align-items-center", "gap-2")

      const spanStart = document.createElement("span")
      spanStart.innerText = log.name
      const smallStart = document.createElement("small")
      smallStart.classList.add("d-block", "text-body-secondary")
      smallStart.innerText = log.email

      const spanEnd = document.createElement("span")
      spanEnd.classList.add("ms-auto", "text-end")
      spanEnd.innerText = formattedDate
      const smallEnd = document.createElement("small")
      smallEnd.classList.add("d-block", "text-body-secondary")
      smallEnd.innerText = `Total: ${counter}`

      // Append
      spanStart.appendChild(smallStart)
      spanEnd.appendChild(smallEnd)
      label.appendChild(spanStart)
      label.appendChild(spanEnd)
      trackList.appendChild(label)
    })
  } catch (error) {
    console.error("Error fetching tracking log:", error)
  }
}
fetchLogs()
