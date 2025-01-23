module.exports = function emailTemplatePassword(user) {
    return `
      <html>
        <body>
          <h2>Hello ${user.name}</h2>
          <p>Click the button below:</p>
          <a href="${process.env.HOST || 'http://localhost:3001'}/track/click?userId=${user.id}" style="text-decoration:none;">
            <button style="padding: 10px; background-color: blue; color: white; border: none; cursor: pointer;">
              Click Me
            </button>
          </a>
        </body>
      </html>
      `
  }
  