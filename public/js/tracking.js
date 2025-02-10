// Tracking Log List
async function fetchLogs() {
  try {
    // Get tracking logs using /tracking api
    const response = await fetch("/api/tracking/get")

    const result = await response.json()

    if (!response.ok) {
      console.error(result)
      return
    }

    // Get tracking log list element and empty it
    const trackList = document.querySelector("#trackingLogList")
    trackList.innerHTML = ""

    // Create tracking log list items
    result.forEach(async (log) => {
      // Format Date
      const date = new Date(log.timestamp)
      const formattedDate = date.toLocaleString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })

      // Div
      const div = document.createElement("div")
      div.classList.add("list-group-item")

      // Upper Div
      const upperDiv = document.createElement("div")
      upperDiv.classList.add("d-flex", "align-items-center", "gap-2")

      // Span for email and counter
      const spanStart = document.createElement("span")
      spanStart.classList.add("d-block", "text-body-secondary")
      spanStart.innerText = `${log.email} | Total: ${log.count}`

      // Span for date
      const spanEnd = document.createElement("span")
      spanEnd.classList.add("ms-auto", "text-end")
      spanEnd.innerText = formattedDate

      // Lower Div
      const lowerDiv = document.createElement("div")
      lowerDiv.classList.add("d-flex", "align-items-center", "gap-2")

      // Small for message
      const small = document.createElement("small")
      small.classList.add("d-block", "text-body-tertiary")
      small.innerText = `${log.message} in ${log.page} template.`

      // Append
      upperDiv.appendChild(spanStart)
      upperDiv.appendChild(spanEnd)

      lowerDiv.appendChild(small)

      div.appendChild(upperDiv)
      div.appendChild(lowerDiv)

      trackList.appendChild(div)
    })
  } catch (error) {
    console.error("Error fetching tracking log:", error)
  }
}

fetchLogs()
