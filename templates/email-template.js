module.exports = function generateEmailTemplate(userId) {
  return `
    <html>
      <body>
        <h2>Phishing Test Email</h2>
        <p>Click the button below:</p>
        <a href="http://localhost:3000/track/click?userId=${userId}" style="text-decoration:none;">
          <button style="padding: 10px; background-color: blue; color: white; border: none; cursor: pointer;">
            Click Me
          </button>
        </a>
      </body>
    </html>
    `
}
