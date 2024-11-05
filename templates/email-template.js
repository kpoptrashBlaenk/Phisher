module.exports = function generateEmailTemplate(user) {
  return `
    <html>
      <body>
        <h2>Hello ${user.name}</h2>
        <p>Click the button below:</p>
        <a href="${process.env.HOST || 'http://localhost:3000'}/track/click?userEmail=${user.email}" style="text-decoration:none;">
          <button style="padding: 10px; background-color: blue; color: white; border: none; cursor: pointer;">
            Click Me
          </button>
        </a>
      </body>
    </html>
    `
}
