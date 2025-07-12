# 📺 YouTube Clone

A YouTube-like video sharing platform built with **React** on the frontend and a **RESTful backend API**. This project features secure user authentication, comprehensive video and channel management, dynamic search, responsive UI components, and real-time toast notifications.

---

## 🚀 Features

### 🔐 User Authentication

- Secure login and registration using **JWT-based authentication**
- Session management with token validation

### 🎥 Video Management

- Upload, edit, delete, and view videos
- Manage video metadata and track user-specific uploads

### 📺 Channel Management

- Create, update, and manage channels and profiles
- Associate videos with channels for better organization

### 🔍 Search Functionality

- Real-time search for videos and channels
- Instant dynamic results

### 🧩 Responsive UI Components

- Built with **React** and **CSS** for mobile-friendly design
- Custom components: Video cards, channel lists, search bars, forms

### 🔔 Notifications

- Real-time **toast notifications** for:
  - Login success/failure
  - Registration
  - Video upload and deletion

### 🌐 Routing & State Management

- Client-side routing with **React Router**
- Efficient state management for:
  - User sessions
  - Video lists
  - UI states

---

## 🛠️ Tech Stack

| Layer         | Tech Stack                             |
| ------------- | -------------------------------------- |
| **Frontend**  | React, React Router, CSS               |
| **Backend**   | Node.js, Express, RESTful API          |
| **Database**  | MongoDB                                |
| **Auth**      | JWT (JSON Web Tokens)                  |
| **UI Alerts** | React-Toastify for toast notifications |

---

## 📦 Installation

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) and npm
- MongoDB database (local or Atlas)

### 🔐 Backend Environment Variables

Create a `.env` file inside the `backend/` directory:

### ```env
DATABASE_URI=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000


## Steps
 # Clone the repository

    git clone https://github.com/Akhileshyadu00/YouTube_1.git
    cd YouTub

    git clone https://github.com/Akhileshyadu00/YT_Backend.git backend


 # Install backend dependencies
    cd backend
    npm install


 # Install frontend dependencies
    cd Youtube
    npm install

 #  Configure environment variables
    Backend .env:

 #   DATABASE_URI=your_database_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=5000

 #  Run the backend server
    cd backend
    npm start


 #   Run the frontend development server
    cd YouTube
    npm run dev


 ### Open the frontend in your browser.
    Register a new user or login with existing credentials.
    Create and customize your channel profile.
    Upload new videos and manage existing ones.
    Search for videos or channels using the search bar.
    Receive instant toast notifications for your actions.


## Project Structure

    /backend
    ├── controllers/      # API logic for users, videos, channels
    ├── models/           # Database schemas
    ├── routes/           # RESTful API routes
    ├── middleware/       # Auth and error handling
    └── server.js         # Entry point

    /frontend
    ├── src/
        ├── components/   # Reusable UI components (video cards, search bar, notifications)
        ├── pages/        # Pages (Home, Login, Register, Channel, Video)
        ├── context/      # State management (Auth, Video data)
        └── App.js        # Main React app with routing

## Contributing

 # Contributions are welcome! To contribute:

    Fork the repository.
    Create a new feature branch (git checkout -b feature-name).
    Commit your changes (git commit -m 'Add feature').
    Push to your branch (git push origin feature-name).
    Open a pull request describing your changes.

## Live Deployment

### 🌍 Frontend on Vercel
Vercel is perfect for React-based apps.

# Steps:
    Push your project to GitHub.
    Go to vercel.com, sign in with GitHub, and import your repo.
    Set the root directory to YouTube/ (the frontend folder).
    Use npm run build as the build command, and set the output directory to build.
    Add environment variables if needed (e.g., REACT_APP_API_URL=https://your-backend.onrender.com/api)

    Deploy!

### ✅ You’ll receive a live frontend URL like:


 # https://(https://youtubeclone1-silk.vercel.app/)

 



## 🖥️ Backend on Render
  Render is great for Express-based APIs.

# Steps:
    Go to render.com and create a new Web Service.
    Connect your YT_Backend GitHub repo.
    Set the root directory to / or backend/, depending on the repo.

    Build Command: npm install
    Start Command: npm start

# ✅ You’ll receive a backend API URL like:

 ### https://your-backend.onrender.com





## 🌍 Live Demo

### Frontend: https://youtubeclone1-silk.vercel.app/
### Backend: https://yt-backend-thbd.onrender.com

