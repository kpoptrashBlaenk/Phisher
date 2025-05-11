// Registration
const registerForm = document.querySelector("#registerForm")

// Registration Button Click
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault()

  // Get elements
  const registerEmail = document.querySelector("#registerEmail")
  const registerPassword = document.querySelector("#registerPassword")
  const registerError = document.querySelector("#registerErrorText")

  // Get values
  const email = registerEmail.value
  const password = registerPassword.value

  // Prepare error messages
  const checkResult = (result) => {
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
  }

  try {
    // Register using /authentication/regiser api
    const response = await fetch("/api/authentication/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const result = await response.json()

    // If not ok, error
    if (!response.ok) {
      checkResult(result)
      return
    }

    // Login using /authentication/login api
    const loginResponse = await fetch("/api/authentication/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const loginResult = await loginResponse.json()

    // If not ok, error
    if (!loginResponse.ok) {
      checkResult(loginResult)
      return
    }

    // If ok, redirect to page returned by api
    window.location.href = loginResult.redirect
  } catch (error) {
    console.error("Error registering admin:", error)
    registerError.innerText = "An error occurred while registering the admin."
    registerError.classList.remove("opacity-0")
  }
})

// Login
const loginForm = document.querySelector("#loginForm")

// Login Button Click
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault()

  // Get elements
  const loginEmail = document.querySelector("#loginEmail")
  const loginPassword = document.querySelector("#loginPassword")
  const loginError = document.querySelector("#loginErrorText")

  // Get values
  const email = loginEmail.value
  const password = loginPassword.value

  try {
    // Login using /authentication/login api
    const response = await fetch("/api/authentication/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const result = await response.json()

    // If not ok, error
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

    // If ok, redirect to page given by result
    window.location.href = result.redirect
  } catch (error) {
    console.error("Error logging in admin:", error)
    loginError.innerText = "An error occurred while logging in the admin."
    loginError.classList.remove("opacity-0")
  }
})
