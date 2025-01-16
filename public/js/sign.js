// Registration
const registerForm = document.querySelector("#registerForm")
const registerEmail = document.querySelector("#registerEmail")
const registerEmailEnd = document.querySelector("#registerEmailEnd")
const registerPassword = document.querySelector("#registerPassword")
const registerError = document.querySelector("#registerErrorText")

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  const email = registerEmail.value + registerEmailEnd.innerText
  const password = registerPassword.value

  try {
    // GET Request
    const response = await fetch("/api/authentication/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const result = await response.json()

    if (!response.ok) {
      registerError.innerText = result.message || "Failed to register"
      registerError.classList.remove("opacity-0")

      switch (result.context) {
        case "both":
          registerEmail.classList.add("is-invalid")
          registerPassword.classList.add("is-invalid")
          break
        case "email":
          registerEmail.classList.add("is-invalid")
          registerPassword.classList.remove("is-invalid")
          break
        case "password":
          registerEmail.classList.remove("is-invalid")
          registerPassword.classList.add("is-invalid")
          break
      }

      return
    }

    window.location.href = result.redirect

    // Create Message
  } catch (error) {
    console.error("Error registering admin:", error)
    registerError.innerText = "An error occurred while registering the admin."
    registerError.classList.remove("opacity-0")
  }
})

// Login
const loginForm = document.querySelector("#loginForm")
const loginEmail = document.querySelector("#loginEmail")
const loginEmailEnd = document.querySelector("#loginEmailEnd")
const loginPassword = document.querySelector("#loginPassword")
const loginError = document.querySelector("#loginErrorText")

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  const email = loginEmail.value + loginEmailEnd.innerText
  const password = loginPassword.value

  try {
    // GET Request
    const response = await fetch("/api/authentication/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const result = await response.json()

    if (!response.ok) {
      loginError.innerText = result.message || "Failed to login"
      loginError.classList.remove("opacity-0")

      switch (result.context) {
        case "both":
          loginEmail.classList.add("is-invalid")
          loginPassword.classList.add("is-invalid")
          break
        case "email":
          loginEmail.classList.add("is-invalid")
          loginPassword.classList.remove("is-invalid")
          break
        case "password":
          loginEmail.classList.remove("is-invalid")
          loginPassword.classList.add("is-invalid")
          break
      }

      return
    }

    window.location.href = result.redirect

    // Create Message
  } catch (error) {
    console.error("Error logging in admin:", error)
    registerError.innerText = "An error occurred while logging in the admin."
    registerError.classList.remove("opacity-0")
  }
})
