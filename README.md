# 📰 Blog Website

A modern, **full‑stack blog platform** built with **React (Vite)** for the frontend and **.NET Core Web API** for the backend.  
It supports user authentication, blog creation with images, pagination, and a responsive, news‑style UI inspired by professional media outlets.

---

## 🚀 Features

### **Frontend (React + Tailwind CSS)**
- **Responsive design** that works across devices
- **Paginated blog listing**
- **Clickable posts** that lead to full detail pages
- **Authentication pages** (Login/Register)
- Integration with backend API using **Axios**
- **Environment variable** support for API base URL

### **Backend (.NET Core Web API + SQL Server)**
- RESTful endpoints for:
  - Blog CRUD operations
  - Authentication (JWT)
  - Comments (Create/Update/Delete)
- Database integration using Entity Framework Core
- Image upload handling (stored in `wwwroot/images`)
- Pagination
- Centralized exception handling middleware
- CORS configured for frontend communication

---

## 📂 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS

**Backend:**
- .NET Core 9.0 Web API
- Entity Framework Core
- SQL Server
- AutoMapper

---

## 📦 Installation

### **1️⃣ Clone the repository**
```bash
git clone https://github.com/yourusername/blog-website.git
cd blog-website
```

---

### **2️⃣ Backend Setup**
1. Navigate to the backend folder:
   ```bash
   cd BlogAPI
   ```
2. Restore dependencies:
   ```bash
   dotnet restore
   ```
3. Update **appsettings.json** with your SQL Server connection string and JWT settings:
   ```json
   "DbSettings": {
     "ConnectionString": "Server=YOUR_SERVER;Database=BlogDB;Trusted_Connection=True;TrustServerCertificate=True;"
   },
   "JwtSettings": {
     "Issuer": "BlogApp",
     "Audience": "BlogApp-Users",
     "Key": "your_secret_key_here"
   }
   ```
4. Run the backend:
   ```bash
   dotnet run
   ```

---

### **3️⃣ Frontend Setup**
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file for your API base URL:
   ```
   VITE_API_BASE_URL=https://localhost:44388
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🗺 API Endpoints (Sample)

| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| GET    | `/api/Blog`           | List blogs (paginated) |
| GET    | `/api/Blog/{id}`      | Get blog by ID         |
| POST   | `/api/Blog`           | Create blog (Auth)     |
| PUT    | `/api/Blog/{id}`      | Update blog (Auth)     |
| DELETE | `/api/Blog/{id}`      | Delete blog (Auth)     |
| POST   | `/api/Auth/login`     | Login user             |
| POST   | `/api/Auth/register`  | Register user          |
| GET    | `/api/Auth/me`        | Get logged in user     |

---

## 🤝 Contributing

1. Fork the repo  
2. Create a new branch:  
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:  
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:  
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request 🎉

---

## 📄 License
This project is licensed under the **MIT License**. You are free to modify and distribute it with attribution.
