# LinkForge – Full Stack Professional Networking Platform

LinkForge is a full-stack professional networking platform inspired by modern networking applications.  
Built using the **MERN Stack + Next.js**, the platform allows users to create professional profiles, connect with other users, and generate downloadable resumes directly from profile data.

---

## 🚀 Features

- 👤 User authentication & authorization
- 🤝 Connection request system (Pending / Accepted)
- 📄 Dynamic resume generation from user profiles
- ⬇️ Resume download functionality
- 🧑‍💼 Professional profile management
- 🔍 User discovery and networking
- ⚡ REST API integration
- 📱 Fully responsive UI
- 🧠 Global state management using Redux Toolkit
- 🚀 Optimized frontend performance

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- Tailwind CSS
- Redux Toolkit

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB

### Deployment
- Vercel
- Render

---

## 🔑 Demo Credentials

```bash
Email: manjith@gmail.com
Password: manjith@123
```

---

## 🧠 System Architecture

```text
Client (Next.js Frontend)
        ↓
REST APIs (Express.js Backend)
        ↓
MongoDB Database
```

- Frontend handles UI rendering and user interactions
- Express.js manages APIs and authentication
- MongoDB stores user, profile, and connection data
- Redux Toolkit manages scalable frontend state

---

## 📂 Project Structure

```bash
LinkForge/
│
├── frontend/          # Next.js frontend
├── backend/           # Node.js + Express backend
├── public/            # Static assets
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/manjityadav/LinkForge.git
cd LinkForge
```

---

### 2️⃣ Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
npm install
```

---

### 3️⃣ Configure Environment Variables

Create a `.env` file inside backend:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

### 4️⃣ Start Development Servers

#### Start Backend

```bash
cd backend
npm start
```

#### Start Frontend

```bash
cd frontend
npm run dev
```

---

## 🌐 Live Demo

### 🔗 Live Project
https://link-forge-mmhf4d5eh-manjeet-yadavs-projects.vercel.app/

### 🔗 GitHub Repository
https://github.com/manjityadav/LinkForge

---

## 📸 Core Functionalities

### ✔️ Authentication System
Implemented secure login and registration workflows with protected routes and token-based authentication.

### ✔️ Connection Management
Users can send, accept, and manage connection requests similar to professional networking platforms.

### ✔️ Resume Generation
Implemented dynamic resume generation using user profile information with direct download support.

### ✔️ Redux State Management
Used Redux Toolkit for scalable and centralized frontend state management.

### ✔️ Responsive Design
Designed responsive interfaces optimized for mobile, tablet, and desktop devices.

---

## 📈 Performance

- Achieved high Lighthouse performance scores
- Optimized API calls and frontend rendering
- Efficient state handling using Redux Toolkit
- Improved loading speed with optimized components

---

## 👨‍💻 Author

### Manjeet Kumar Yadav

- GitHub: https://github.com/manjityadav
- LinkedIn: https://www.linkedin.com/in/manjith-yadav-071b99276/
- Portfolio: https://portfolio-jc4u.onrender.com/
