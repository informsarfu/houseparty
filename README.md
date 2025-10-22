# 🏠 House Party  
**A real-time file-sharing and collaboration platform built with React and Django REST Framework**

House Party enables multiple users to join shared rooms, upload and view files securely, and collaborate in real time.  
It integrates a JWT-based authentication system for secure access, optimized API interactions, and automated media management.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT authentication using **Django REST Framework SimpleJWT** with access and refresh tokens.
- Secure logout through token blacklisting to invalidate refresh tokens.
- Protected React routes ensure only authenticated users access the dashboard.

### 💾 File Sharing System
- Create, join, and manage **rooms** via unique room codes.
- Upload multiple files simultaneously with real-time previews for images and PDFs.
- Delete files directly and maintain clean storage with Django model cascading delete logic.

### ⚡ Frontend (React + TypeScript)
- Built an intuitive, responsive interface using **React** and **TypeScript**.
- Managed state efficiently with **React Hooks** (`useState`, `useEffect`, `useRef`).
- Reduced API overhead by using **Axios caching** and controlled dependency arrays.
- Modal-based file previews for a clean, user-friendly experience.

### 🧠 Backend (Django + DRF)
- Designed RESTful APIs with **Django REST Framework**, serializers, and permission classes.
- Room-based file organization with clear relational models between users and uploads.
- Implemented cascading deletion logic to remove media files automatically when rooms are deleted.

### ☁️ Database & Storage
- **PostgreSQL** used for relational data (users, rooms, metadata).
- File uploads handled via Django’s built-in **File Storage System**.

---

## 🧩 Tech Stack

| Layer | Technologies |
|:------|:--------------|
| **Frontend** | React, TypeScript, Axios, CSS3 |
| **Backend** | Django, Django REST Framework |
| **Auth** | JWT (Access/Refresh Tokens via SimpleJWT) |
| **Database** | PostgreSQL |
| **Storage** | Django File Storage System |
| **Deployment** | *(Add your platform: AWS / Render / Vercel etc.)* |

---

## ⚙️ API Endpoints Overview

| Method | Endpoint | Description |
|:-------|:----------|:-------------|
| `POST` | `/api/auth/token/` | Obtain JWT access and refresh tokens |
| `POST` | `/api/auth/token/refresh/` | Refresh access token |
| `POST` | `/api/auth/logout/` | Blacklist refresh token (logout) |
| `GET` | `/api/rooms/` | Fetch all rooms for the authenticated user |
| `POST` | `/api/rooms/` | Create a new room |
| `POST` | `/api/rooms/{room_code}/access/` | Join a room |
| `DELETE` | `/api/rooms/{room_code}/access/` | Leave a room |
| `GET` | `/api/rooms/{room_code}/files/` | Get files in a room |
| `POST` | `/api/rooms/{room_code}/files/` | Upload a file |
| `DELETE` | `/api/rooms/{room_code}/files/` | Delete a file |

---

## 🧠 Key Learning Outcomes
- Implemented secure **JWT authentication** and token lifecycle management.
- Designed **React Hooks-based** state management and API integration.
- Developed **cascading media cleanup** logic to prevent orphaned files.
- Enhanced full-stack debugging and optimized frontend-backend communication.

---

## 💡 Future Improvements
- Add **real-time updates** using WebSockets (Django Channels or Firebase).
- Implement **role-based access control** within rooms.
- Add **drag-and-drop file uploads** and upload progress bars.
- Deploy complete CI/CD pipeline on cloud infrastructure.

---

## 🛠️ Setup & Installation

### Backend Setup
```bash
# Clone repository
git clone https://github.com/your-username/house-party.git
cd house-party/backend

# Create virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start server
python manage.py runserver
