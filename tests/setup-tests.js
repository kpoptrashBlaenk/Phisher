beforeAll(() => {
  if (!global.authCookies) {
    throw new Error("Authentication cookies file is missing!")
  }
})
