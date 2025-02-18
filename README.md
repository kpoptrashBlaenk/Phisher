# **Phisher**

_This is totally not a phishing simulator that sends phishing emails to chosen people and and tracks if those idiots fell for it._

## **Table of Contents**

1. [Features](#features)
2. [Gmail SMTP Server](#gmail-smtp-server)
3. [Installation](#installation)
4. [Database Schema](#database-schema)
5. [Routes Schema](#routes-schema)
6. [Run and Test](#run-and-test)
7. [Technologies Used](#technologies-used)

---

## **Features**

- Only administrators have access!
- Send emails to employes and track their behaviour!
- Choose one out of multiple templates to send!
- Access to a log of all the actions!

## **Gmail SMTP Server**

1. Create gmail account

2. Activate 2-Factor Security

3. Add App Password

4. Use App Password in SMTP in .env in next step

## **Installation**

1. Clone the repository:

   ```cmd
   git clone https://github.com/TotallyNotAPhishingSimulator/Phisher.git
   cd Phisher
   ```

2. Install dependencies:

   ```cmd
   npm install
   ```

3. Set up environment variables and fill it out.

   ```cmd
   copy env.template .env
   ```

4. Set up the database.

   ```cmd
   npm run migrate
   ```

![Database Schema](./config/database.png)

## **Database Schema**

![Database Schema](./config/database.png)

## **Routes Schema**

![Routes Schema](./controller/routes.svg)

## **Run and Test**

- **Start the Express server:**

  ```cmd
  npm run start
  ```

- **Run Jest tests:**

  ```cmd
  npm run test
  ```

## **Technologies Used**

- **Typescript / Javascript** – Language
- **Bootstrap** – CSS
- **Express.js** – Backend server
- **Node.js** – Javascript runtime
- **PostgreSQL** – Database
- **Nodemailer.js** - Emails
- **Bcrypt / Cookie-Parser / Jsonwebtoken / Password-Validator** - Authentication
- **Jest / Supertest** - Testing
