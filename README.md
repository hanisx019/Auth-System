# Auth-System

A full-stack authentication system with user registration, login, email verification, password reset, and protected routes. Built with React (Vite) frontend and Node.js/Express/MongoDB backend.

## Features
- User registration and login
- Email verification (with OTP)
- Password reset via email OTP
- JWT-based authentication
- Protected routes
- React Context for global state
- Toast notifications for feedback

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Email:** Nodemailer (Gmail SMTP or Brevo/Sendinblue)

## Folder Structure
```
client/           # React frontend
  src/
    assets/       # Images and icons
    components/   # Reusable UI components
    context/      # React Context (AppContext)
    pages/        # Page components (Login, Home, etc.)
    ...
server/           # Node.js backend
  controllers/    # Route controllers (auth, user)
  models/         # Mongoose models
  routes/         # Express routes
  config/         # Config files (db, nodemailer)
  middleware/     # Auth middleware
  ...
```

## Getting Started

### Prerequisites
- Node.js and npm
- MongoDB (local or Atlas)

### 1. Clone the repository
```
git clone https://github.com/hanisx019/Auth-System.git
cd Auth-System
```

### 2. Setup Backend
```
cd server
npm install
```
- Create a `.env` file in `server/` with:
  ```
  PORT=5000
  MONGODB_URL=mongodb://localhost:27017
  JWT_SECRET=your_jwt_secret
  NODE_ENV=development
  SMTP_USER=your_email@gmail.com
  SMTP_PASS=your_gmail_app_password
  SENDER_EMAIL=your_email@gmail.com
  ```
- Start the backend:
  ```
  npm start
  ```

### 3. Setup Frontend
```
cd ../client
npm install
```
- Create a `.env` file in `client/` with:
  ```
  VITE_BACKEND_URL=http://localhost:5000
  ```
- Start the frontend:
  ```
  npm run dev
  ```

### 4. Usage
- Visit `http://localhost:5173` in your browser.
- Register a new user, verify email, login, and test password reset.

## Environment Variables
- **Backend:**
  - `PORT`: Backend server port
  - `MONGODB_URL`: MongoDB connection string
  - `JWT_SECRET`: Secret for JWT
  - `SMTP_USER`/`SMTP_PASS`: Email credentials (Gmail App Password recommended)
  - `SENDER_EMAIL`: Sender email address
- **Frontend:**
  - `VITE_BACKEND_URL`: Backend API URL

## Notes
- For Gmail SMTP, enable 2FA and use an App Password.
- For production, use environment variables securely and update CORS settings.

## License
MIT
