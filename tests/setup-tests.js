beforeAll(() => {
  if (!global.authCookies) {
    throw new Error("Authentication cookies are not set!")
  }
})
