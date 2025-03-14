import path from "path"

export default {
  globalSetup: path.resolve("tests", "global-setup.js"),
  testEnvironment: "node",
  setupFilesAfterEnv: [path.resolve("tests", "setup-tests.js")],
  testPathIgnorePatterns: [
    "/node_modules/",
    // "/tests/admin.test.js",
    // "/tests/team.test.js",
    // "/tests/user.test.js",
    // "/tests/tracking.test.js",
    // "/tests/email.test.js",
    // "/tests/authentication.test.js",
  ],
}
