const trackingLogButton = document.querySelector("#trackingLogButton")
const trackingLogColumn = document.querySelector("#trackingLogColumn")
const trackingLogCardBody = document.querySelector("#trackingLogCardBody")
const usersButton = document.querySelector("#usersButton")
const usersColumn = document.querySelector("#usersColumn")
const usersCardBody = document.querySelector("#usersCardBody")

trackingLogButton.addEventListener("click", () => {
  toggleSides()
})

usersButton.addEventListener("click", () => {
  toggleSides()
})

function toggleSides() {
  trackingLogColumn.classList.toggle("col-md-5")
  trackingLogColumn.classList.toggle("col-md-1")
  usersColumn.classList.toggle("col-md-5")
  usersColumn.classList.toggle("col-md-1")
  trackingLogCardBody.classList.toggle("d-none")
  usersCardBody.classList.toggle("d-none")
}
