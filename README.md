# Qeematech Educational Platform 🎓

A modern, full-stack educational management system designed for schools to manage students, lessons, and profiles with ease. Built with high performance and security in mind.

---

## 🚀 Overview

Qeematech Educational Platform provides a seamless experience for both **School Administrators** and **Students**. It facilitates lesson delivery, favorite tracking, and user management through a robust API and a highly responsive dashboard.

---

## 🛠️ Technology Stack

### **Backend**
- **Runtime**: Node.js (v20+)
- **Framework**: Express.js (v5.x - Next Generation)
- **Database ORM**: Prisma with MySQL
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only Cookies
- **Security**: Bcrypt for password hashing
- **Validation**: Joi (Schema-based validation)
- **File Handling**: Multer (for profile and lesson image uploads)

### **Frontend**
- **Framework**: React 19 (Latest stable)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.0 (Enhanced design performance)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router 7
- **Icons**: Lucide React

---

## ✨ Key Features

### **For Administrators (Schools)**
- 📊 **Dashboard**: Overview of school statistics.
- 👨‍🎓 **Student Management**: Full CRUD operations for student accounts.
- 📚 **Lesson Management**: Create and update lessons with descriptions and media.
- 🖼️ **Profile Customization**: Update school details, logo, and address.

### **For Students**
- 📖 **Lesson Explorer**: Browse lessons available in their school.
- ⭐ **Favorites**: Save and manage preferred lessons for quick access.
- 👤 **Profile Management**: Update personal information and profile picture.

---

## 📂 Project Structure

```text
qeematech-edu-platform/
├── backend/                # Express API & Prisma Schema
│   ├── prisma/             # Database models & migrations
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth & Error middlewares
│   │   ├── routes/         # API Endpoints
│   │   ├── utils/          # Helper functions
│   │   └── app.js          # Entry point
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Admin & Student dashboards
│   │   ├── services/       # API integration (Axios)
│   │   └── App.jsx         # Routing & Layout
└── API_Collection.json     # Postman Collection for testing
```

---

## ⚙️ Installation & Setup

### **1. Prerequisites**
- Node.js installed.
- MySQL server running.

### **2. Backend Setup**
1. Navigate to `/backend`.
2. Install dependencies: `npm install`.
3. Configure `.env` (use `.env.example` as a template).
4. Sync database: `npx prisma db push`.
5. Start server: `npm run dev`.

### **3. Frontend Setup**
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Configure `.env` for `VITE_API_URL`.
4. Start development server: `npm run dev`.

---

## 🔒 Security & Best Practices
- **JWT-only Auth**: Sessions are managed securely via tokens.
- **Input Sanitization**: All requests are validated using Joi schemas.
- **Database Safety**: Prisma handles SQL injection prevention and type safety.
- **Clean Architecture**: Separation of routes, controllers, and services.

---

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

Developed with ❤️ by **Ahmed Salah**.
