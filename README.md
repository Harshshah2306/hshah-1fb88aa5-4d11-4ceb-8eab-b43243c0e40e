# 🚀 TurboVets Coding Challenge - Task Management Dashboard

A full-stack RBAC (Role-Based Access Control) Task Management System built with **NestJS**, **Angular**, **PostgreSQL**, and **TypeORM** inside an **Nx Monorepo**.

---

## 📋 Features Implemented

### 1. **Authentication & Security**
* **JWT Authentication:** Secure login system with access tokens.
* **RBAC (Role-Based Access Control):**
    * **ADMIN:** Can create tasks, assign users, delete tasks, and view Audit Logs.
    * **USER:** Can only view and update tasks assigned to them.
* **Password Hashing:** Uses bcrypt for secure password storage.

### 2. **Task Management**
* **CRUD Operations:** Full Create, Read, Update, Delete capabilities.
* **Kanban Board Style:** Tasks are visually separated into "Todo" and "Done" lists.
* **Drag & Drop:** (Frontend) Tasks can be moved between states interactively.
* **Status Workflow:** Tasks transition from `OPEN` → `IN_PROGRESS` → `DONE`.

### 3. **Audit Logging**
* Tracks critical actions (e.g., "User X created Task Y").
* Stored in a dedicated `AuditLog` table for compliance and history.
* Accessible only via the Admin Dashboard.

### 4. **Modern UI/UX**
* **Framework:** Angular (Standalone Components).
* **Styling:** TailwindCSS for a responsive, modern design.
* **State Management:** RxJS for reactive data handling.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Monorepo** | [Nx](https://nx.dev) |
| **Backend** | [NestJS](https://nestjs.com) |
| **Database** | SQLlite |
| **ORM** | TypeORM |
| **Frontend** | [Angular](https://angular.io) |
| **Styling** | [TailwindCSS](https://tailwindcss.com) |
| **Testing** | Jest (Backend & Frontend) |

---

## ⚙️ Setup & Installation

### 1. Prerequisites
* Node.js (v16+)
* PostgreSQL installed and running
* npm or yarn

### 2. Installation
```bash
# Install dependencies
npm install
