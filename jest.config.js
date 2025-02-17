import path from "path"

export default {
  globalSetup: path.resolve("tests", "global-setup.js"),
  testEnvironment: "node",
  setupFilesAfterEnv: [path.resolve("tests", "setup-tests.js")],
  testPathIgnorePatterns: ["/node_modules/", "/tests/admin.test.js", "/tests/team.test.js"],
}
