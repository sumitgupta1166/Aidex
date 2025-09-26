# Aidex – Intelligent Support Hub 🛠️

Aidex is a **full-stack MERN Helpdesk Application** with real-time ticket management, role-based dashboards, and a knowledge base system.  
It is built to support **Customers, Agents, and Admins** with efficient support workflows.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based authentication (login, register, logout).
- Role support: **Customer**, **Agent**, **Admin**.

### 🎫 Ticket Management
- Customers can create new tickets.
- Agents/Admins can assign tickets and update status.
- Real-time chat on each ticket using **Socket.IO**.
- Role-based access control (customers see their own, agents see dept tickets, admins see all).

### 📚 Knowledge Base
- Full-text search across articles.
- Admins can create/manage KB articles.
- Smart suggestions when creating tickets.

### 📊 Dashboards
- **Customer:** View & manage their own tickets.
- **Agent:** Department ticket queues, assigned ticket workspace.
- **Admin:** Analytics dashboard, KB management, global ticket control.

### ⚡ Real-time
- Socket.IO for **new ticket alerts**, **ticket updates**, and **chat messages**.

---

## 🛠️ Tech Stack

- **Frontend:** Vite + React + Tailwind CSS + React Router + React Toastify + Recharts
- **Backend:** Node.js + Express.js + MongoDB + Mongoose + Socket.IO
- **Database:** MongoDB Atlas (recommended)
- **Auth & Security:** JWT, bcrypt, Helmet, CORS

---

## 📂 Project Structure

### Backend (`/backend`)
backend/
├─ src/
│ ├─ config/ # DB config
│ ├─ controllers/ # Business logic
│ ├─ middleware/ # Auth & validation
│ ├─ models/ # Mongoose schemas
│ ├─ routes/ # API endpoints
│ ├─ sockets/ # Socket.IO handlers
│ ├─ utils/ # Helpers
│ ├─ app.js # Express app
│ └─ server.js # Entry point
└─ .env

shell
Copy code

### Frontend (`/frontend`)
frontend/
├─ src/
│ ├─ pages/ # Login, Register, Dashboard, Tickets, KB
│ ├─ components/ # NavBar, Modal, ChatBox, etc.
│ ├─ hooks/ # useAuth
│ ├─ services/ # Axios API client
│ ├─ sockets/ # Socket connection
│ └─ App.jsx
└─ .env

yaml
Copy code

---

## ⚙️ Setup & Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-username/aidex.git
cd aidex
2. Setup Backend
bash
Copy code
cd backend
npm install
Create .env file in backend/:

env
Copy code
PORT=8000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=aidex_db
CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRY=10h

BCRYPT_SALT_ROUNDS=10
NODE_ENV=development
TICKET_ID_MODE=sequential   # options: sequential | uuid
Run backend:

bash
Copy code
npm run dev
3. Setup Frontend
bash
Copy code
cd frontend
npm install
Create .env file in frontend/:

env
Copy code
VITE_API_BASE_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:8000
Run frontend:

bash
Copy code
npm run dev
🧪 API Testing (Postman)
Import Aidex.postman_collection.json to test:

Auth: Register/Login/Logout

Tickets: Create, assign, update, chat

KB: Search and manage articles

🌐 Deployment
Recommended Free Hosting:
Backend: Render or Railway

Database: MongoDB Atlas

Frontend: Vercel or Netlify

👥 Roles
Customer: Can create/view their own tickets.

Agent: Can manage tickets in assigned departments.

Admin: Full control, analytics, KB management.