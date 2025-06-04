# Task Manager Backend

A real-time task manager backend built with **Node.js**, **Express.js**, **MongoDB**, and **Socket.IO**. This application allows managers and employees to interact through task assignments, updates, and real-time notifications.

---

##  1. Project Overview

This backend system provides:

- User authentication (Login/Register).
- Role-based access: `Manager` and `Employee`.
- RESTful APIs to create, update, and fetch tasks.
- Real-time communication using **Socket.IO**.
- MongoDB for data storage.

### Assumptions

- Two user roles: `Manager` (can assign/update tasks) and `Employee` (can view/update their own tasks).
- Socket connection is established after successful login.
- JWT tokens are passed via headers for protected routes and Socket.IO handshake.

---

##  2. Setup Instructions

###  Clone the Repository

```bash
git clone https://github.com/MrShekh/task-manager.git
cd task-manager-backend

// Install Dependencies
npm install


// Setup Environment Variables
Create a .env file in the root directory with the following (do not share secrets):

env

PORT=5000
MONGO_URI=mongodb+srv://<your-mongodb-uri>
JWT_SECRET=your_jwt_secret
// Run the Backend Server

npm start
Server runs on http://localhost:5000.

 3. API Documentation
// Authentication
   Auth Routes
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user and get token

Example Response:

json

{
  "user": {
    "id": "abc123",
    "name": "John Doe",
    "role": "manager"
  },
  "token": "your_jwt_token"
}
 Task Routes
Method	Endpoint	Description
POST	/api/tasks	Create a new task (Manager only)
GET	/api/tasks	Get all tasks (Based on role)
PATCH	/api/tasks/:id	Update task status
DELETE	/api/tasks/:id	Delete task (Manager only)

Example Task Object:

json:
{
  "title": "Update frontend UI",
  "description": "Redesign login page using Tailwind",
  "assignedTo": "employeeId",
  "status": "pending"
}

 Folder Structure:
task-manager-backend

 controllers/        # Route logic
 models/             # Mongoose schemas
 routes/             # Route declarations
 middlewares/        # Auth & role checkers
 socket/             # WebSocket handlers
 config/             # MongoDB connection
 .env                # Environment config
 server.js           # Entry point


// Author
Shekh Asif
B.Tech CSE @ Rai University, Ahmedabad