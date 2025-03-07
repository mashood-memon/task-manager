# Task Manager

A task management application with authentication and real-time updates.

## Features

- User authentication (login/register)
- Create, edit, and delete tasks
- Filter tasks by priority, status, and due date
- Task analytics dashboard
- Real-time status updates

## Setup

### Prerequisites

- Node.js
- MongoDB

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd task-manager
npm install
npm run dev
```

The application will be running on:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Environment Variables

Create a `.env` file in the backend directory:

```
MONGO_URI=mongodb://127.0.0.1:27017/users
JWT_SECRET=your_secret_key
```
