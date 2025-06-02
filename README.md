# WFHTrack# 🛠️ WFHTrack Backend

This is the backend API for **WFHTrack**, a Work From Home attendance system. It handles authentication, attendance submission, and admin monitoring functionality.

## 🔧 Tech Stack

- **Node.js** + **Express.js**
- **Knex.js** (SQL query builder)
- **MySQL** (Database)
- **JWT Authentication**
- **CORS** middleware

## 🚀 Features

- User & Admin role-based access
- PASET0-based login authentication
- Daily attendance submission
- Admin dashboard for monitoring users and attendance
- RESTful API endpoints

## 📁 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/apop01100/WFHTrack-Backend.git
cd WFHTrack-Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Dependencies

Create a .env file in the root folder:

```bash
PORT=5000
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=wfhtrack
PASET0_SECRET=your_paseto_secret_key
```

### 4. Run Migrations

```bash
npx knex migrate:latest
```

### 5. Start the Server

```bash
npm start
```
