# 💸 SpendWise API

SpendWise is a financial tracker system that helps users manage income, expenses, wallets, and money transfers. This is the backend API built with Node.js, Express, Prisma ORM, and MySQL.

---

## 🚀 Features

- ✅ User registration and login with email verification
- 💼 Create and manage wallets
- 💰 Track income and expenses
- 🔁 Transfer funds between wallets
- 🔒 JWT authentication
- 📦 RESTful API structure with version control

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **ORM**: Prisma
- **Database**: MySQL (XAMPP local server)
- **Auth**: JWT (JSON Web Token)
- **Email**: Nodemailer (for verification)

---

## 🧪 Getting Started

### 1. Clone the repository

```bash
git clone 
cd spendwise
change the .env file DATABASE_URL="mysql://root:@localhost:3306/your-table-name"
npm install
run npx prisma db push
npm run dev