# 🧾 InvoicePro - Multi-Role User Management System

<div align="center">

![InvoicePro Logo](https://img.shields.io/badge/InvoicePro-Multi--Role%20System-blue?style=for-the-badge&logo=invoice&logoColor=white)

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.6-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

*A comprehensive invoice management system with sophisticated multi-role user management and super admin control*

[Features](#-features) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Demo](#-demo)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Demo Account](#-demo-account)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Role Hierarchy](#-role-hierarchy--permissions)
- [Username Generation](#-username-generation-logic)
- [Security Features](#-security-features)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 **Advanced Multi-Role Authentication**
- **SUPER_ADMIN**: Global system access across all companies
- **ADMIN**: Complete control over company-specific data
- **STAFF**: Granular permission-based access control

### 👥 **Intelligent User Management**
- Smart username auto-generation with fallback logic
- Company-based user organization and isolation
- Real-time user activation/deactivation
- Comprehensive user profile management

### 🛡️ **Granular Permission System**
- **MANAGE_USERS**: Create, update, and manage user accounts
- **MANAGE_INVOICES**: Full invoice lifecycle management
- **MANAGE_CUSTOMERS**: Complete customer relationship management
- Checkbox-based permission assignment interface

### 🏢 **Enterprise Company Management**
- Strict one-admin-per-company enforcement
- Multi-staff support with role-based access
- Company data isolation and security
- Scalable multi-tenant architecture

### 🎨 **Modern User Interface**
- Responsive design with Tailwind CSS
- Intuitive role-based navigation
- Real-time notifications and feedback
- Accessible and mobile-friendly interface

---

## 🛠 Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### **Backend**
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.3
- **Database**: PostgreSQL 13+
- **ORM**: Drizzle ORM 0.29
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod schema validation
- **Security**: Helmet.js, CORS

</td>
<td valign="top" width="50%">

### **Frontend**
- **Framework**: React 18.2
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.3
- **Routing**: React Router 6.20
- **Forms**: React Hook Form 7.48
- **HTTP Client**: Axios 1.6
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites
```bash
# Required software
Node.js >= 18.0.0
PostgreSQL >= 13.0.0
npm >= 8.0.0
```

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/invoicepro.git
   cd invoicepro
   ```

2. **Install Dependencies**
   ```bash
   # Install all dependencies (root, server, client)
   npm install
   
   # Or install individually
   cd server && npm install
   cd ../client && npm install
   ```

3. **Database Setup**
   ```sql
   -- Connect to PostgreSQL and run:
   CREATE DATABASE invoicepro;
   CREATE USER invoicepro_user WITH PASSWORD 'secure_password_123';
   GRANT ALL PRIVILEGES ON DATABASE invoicepro TO invoicepro_user;
   ```

4. **Environment Configuration**
   
   Create `server/.env`:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://invoicepro_user:secure_password_123@localhost:5432/invoicepro
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # Client Configuration
   CLIENT_URL=http://localhost:3000
   ```

5. **Database Migration & Seeding**
   ```bash
   # Run database migrations
   npm run migrate
   
   # Seed initial data (creates super admin)
   npm run seed
   ```

6. **Start Development Server**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run server:dev  # Backend only (port 3001)
   npm run client:dev  # Frontend only (port 3000)
   ```

7. **Access the Application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **Health Check**: http://localhost:3001/api/health

---

## 🔑 Demo Account

After running the seed script, use these credentials to access the super admin account:

```
🔐 Super Admin Login
Username: superadmin
Email: er.ankit30@gmail.com
Password: ankit123456
Role: SUPER_ADMIN
```

**Super Admin Capabilities:**
- ✅ Create and manage users across all companies
- ✅ Assign roles (ADMIN/STAFF) to users
- ✅ Grant granular permissions to staff members
- ✅ View and manage all company data
- ✅ System-wide administrative control

---

## 📁 Project Structure

```
invoicepro/
├── 📁 server/                     # Backend Express Application
│   ├── 📁 src/
│   │   ├── 📁 database/          # Database Schema & Migrations
│   │   │   ├── schema.ts         # Drizzle ORM Schema
│   │   │   ├── connection.ts     # Database Connection
│   │   │   ├── migrate.ts        # Migration Runner
│   │   │   ├── seed.ts           # Data Seeding
│   │   │   └── 📁 migrations/    # SQL Migration Files
│   │   ├── 📁 middleware/        # Auth & Security Middleware
│   │   │   └── auth.ts           # JWT & Role-based Auth
│   │   ├── 📁 routes/            # API Route Handlers
│   │   │   ├── auth.ts           # Authentication Routes
│   │   │   ├── users.ts          # User Management
│   │   │   ├── roles.ts          # Role Assignment
│   │   │   └── permissions.ts    # Permission Management
│   │   ├── 📁 utils/             # Utility Functions
│   │   │   └── username.ts       # Username Generation
│   │   └── index.ts              # Server Entry Point
│   ├── .env.example              # Environment Template
│   ├── package.json              # Server Dependencies
│   ├── tsconfig.json             # TypeScript Config
│   └── drizzle.config.ts         # Drizzle Configuration
├── 📁 client/                    # Frontend React Application
│   ├── 📁 src/
│   │   ├── 📁 components/        # Reusable UI Components
│   │   │   ├── 📁 ui/            # Base UI Components
│   │   │   └── Layout.tsx        # Main Layout Component
│   │   ├── 📁 contexts/          # React Context Providers
│   │   │   └── AuthContext.tsx   # Authentication Context
│   │   ├── 📁 pages/             # Page Components
│   │   │   ├── Login.tsx         # Login Page
│   │   │   ├── Dashboard.tsx     # Main Dashboard
│   │   │   ├── UserManagement.tsx # User Management
│   │   │   └── RoleManagement.tsx # Role & Permission Management
│   │   ├── 📁 services/          # API Service Layer
│   │   │   └── api.ts            # HTTP Client & API Calls
│   │   ├── 📁 types/             # TypeScript Definitions
│   │   │   └── auth.ts           # Authentication Types
│   │   ├── App.tsx               # Main App Component
│   │   ├── index.tsx             # React Entry Point
│   │   └── index.css             # Global Styles
│   ├── 📁 public/                # Static Assets
│   ├── package.json              # Client Dependencies
│   ├── tailwind.config.js        # Tailwind Configuration
│   └── tsconfig.json             # TypeScript Config
├── package.json                  # Root Package Configuration
├── setup.sh                      # Automated Setup Script
└── README.md                     # Project Documentation
```

---

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| `POST` | `/api/auth/login` | User authentication | Public |

**Login Request:**
```json
{
  "username": "superadmin",
  "password": "ankit123456"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "superadmin",
    "email": "er.ankit30@gmail.com",
    "firstName": "Super",
    "lastName": "Admin",
    "companyName": "InvoicePro System",
    "role": "SUPER_ADMIN",
    "permissions": ["MANAGE_USERS", "MANAGE_INVOICES", "MANAGE_CUSTOMERS"]
  }
}
```

### User Management Endpoints

| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| `POST` | `/api/users/create` | Create new user | Super Admin |
| `GET` | `/api/users` | Get all users | Super Admin |
| `GET` | `/api/users/company/:name` | Get users by company | Super Admin |
| `GET` | `/api/users/companies` | Get all companies | Super Admin |
| `PATCH` | `/api/users/:id/status` | Update user status | Super Admin |

**Create User Request:**
```json
{
  "email": "john.doe@company.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "ABC Corporation",
  "mobileNumber": "1234567890",
  "role": "ADMIN"
}
```

### Role & Permission Endpoints

| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| `POST` | `/api/roles/assign` | Assign role to user | Super Admin |
| `POST` | `/api/permissions/assign` | Assign permissions | Super Admin |
| `GET` | `/api/permissions/available` | Get available permissions | Super Admin |

---

## 🗄️ Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company_name VARCHAR(200) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  role role_enum DEFAULT 'STAFF',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### User Permissions Table
```sql
CREATE TABLE user_permissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  permission permission_enum NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Enums
```sql
CREATE TYPE role_enum AS ENUM ('SUPER_ADMIN', 'ADMIN', 'STAFF');
CREATE TYPE permission_enum AS ENUM ('MANAGE_USERS', 'MANAGE_INVOICES', 'MANAGE_CUSTOMERS');
```

---

## 🏗️ Role Hierarchy & Permissions

### Permission Matrix

| Feature | SUPER_ADMIN | ADMIN | STAFF |
|---------|-------------|-------|-------|
| **User Management** | ✅ All Companies | ✅ Own Company | 🔒 With Permission |
| **Role Assignment** | ✅ Global | ❌ No | ❌ No |
| **Invoice Management** | ✅ All Companies | ✅ Own Company | 🔒 With Permission |
| **Customer Management** | ✅ All Companies | ✅ Own Company | 🔒 With Permission |
| **System Settings** | ✅ Full Access | ❌ No | ❌ No |
| **Company Data** | ✅ All | ✅ Own Only | ✅ Own Only |

### Business Rules

1. **One Admin Per Company**: Each company can have only one ADMIN user
2. **Multiple Staff**: Companies can have unlimited STAFF users
3. **Super Admin Global**: SUPER_ADMIN is not tied to any specific company
4. **Permission Inheritance**: ADMIN users automatically have all permissions
5. **Company Isolation**: Non-super-admin users can only access their company's data

---

## 🔤 Username Generation Logic

The system automatically generates unique usernames using a smart algorithm:

### Generation Steps

1. **Base Username Creation**
   ```
   firstName + companyName (sanitized, lowercase, max 20 chars)
   ```

2. **Uniqueness Check**
   - If unique → Use base username
   - If taken → Proceed to step 3

3. **Mobile Number Fallback**
   ```
   baseUsername + last4DigitsOfMobile
   ```

4. **Incremental Fallback**
   ```
   baseUsername + last4Digits + incrementalNumber
   ```

### Example Generation

```javascript
// Input
firstName: "John"
companyName: "ABC Corporation"
mobileNumber: "1234567890"

// Step 1: Base username
"johnabccorporation" → "johnabccorp" (truncated to 20 chars)

// Step 2: If taken, add mobile digits
"johnabccorp7890"

// Step 3: If still taken, add incremental number
"johnabccorp78901", "johnabccorp78902", etc.
```

---

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Role-Based Access Control (RBAC)**: Multi-level permission system
- **Company Data Isolation**: Strict data segregation

### Security Middleware
- **Helmet.js**: Security headers protection
- **CORS**: Cross-origin resource sharing control
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM

---

## 💻 Development

### Available Scripts

```bash
# Root level commands
npm run dev          # Start both frontend and backend
npm run build        # Build frontend for production
npm run migrate      # Run database migrations
npm run seed         # Seed database with initial data

# Server specific
npm run server:dev   # Start backend development server
npm run server:build # Build backend TypeScript

# Client specific
npm run client:dev   # Start frontend development server
npm run client:build # Build frontend for production
```

### Environment Variables

#### Server (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/invoicepro

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Server
PORT=3001
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:3000
```

---

## 🚀 Deployment

### Production Environment Variables
```env
# Database (Use connection pooling for production)
DATABASE_URL=postgresql://user:password@prod-host:5432/invoicepro

# Security (Use strong, unique values)
JWT_SECRET=your-production-jwt-secret-key-64-characters-minimum

# Server
PORT=3001
NODE_ENV=production

# CORS (Your production domain)
CLIENT_URL=https://yourdomain.com
```

### Deployment Steps
1. **Build Applications**: `npm run build`
2. **Setup Database**: Run migrations and seed data
3. **Configure Environment**: Set production environment variables
4. **Deploy**: Use your preferred hosting platform (Heroku, Vercel, DigitalOcean, etc.)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

- **Email**: er.ankit30@gmail.com
- **GitHub Issues**: For bug reports and feature requests
- **Documentation**: Check this README and inline code comments

---

<div align="center">

**Built with ❤️ for modern invoice management**

[⬆ Back to Top](#-invoicepro---multi-role-user-management-system)

</div>
