# 📅 BookEase — Online Booking System

A modern, full-featured online appointment booking system built with Next.js, Node.js, and MongoDB.

🌐 **Live Demo:** [https://booking-system-gamma-hazel.vercel.app](https://booking-system-gamma-hazel.vercel.app)

---

## ✨ Features

### 👤 User Features
- Register and login with JWT authentication
- Browse available services by category
- Book appointments with date and time slot selection
- View and manage personal appointments
- Cancel pending appointments

### ⚙️ Admin Features
- Admin dashboard with booking statistics
- Add and manage services (name, description, duration, price, category)
- View all bookings from all users
- Update booking status (Pending → Confirmed → Completed → Cancelled)

### 🔐 Security
- JWT authentication with 30-day token expiry
- Bcrypt password hashing
- Role-based access control (user/admin)
- Protected routes — admin and user panels are separate

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 15 | Full stack React framework |
| Tailwind CSS | Styling |
| MongoDB + Mongoose | Database |
| JWT + Bcrypt | Authentication |
| Vercel | Deployment |
| MongoDB Atlas | Database Hosting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Reffin/booking-system.git
cd booking-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env.local`:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
booking-system/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.js
│   │   │   │   └── register/route.js
│   │   │   ├── services/route.js
│   │   │   └── bookings/
│   │   │       ├── route.js
│   │   │       └── [id]/route.js
│   │   ├── admin/page.js
│   │   ├── dashboard/page.js
│   │   ├── login/page.js
│   │   ├── register/page.js
│   │   ├── layout.js
│   │   └── page.js
│   ├── lib/
│   │   ├── db.js
│   │   └── auth.js
│   └── models/
│       ├── User.js
│       ├── Service.js
│       └── Booking.js
└── package.json
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/services` | Get all services |
| POST | `/api/services` | Add service (Admin) |
| GET | `/api/bookings` | Get bookings (user/admin) |
| POST | `/api/bookings` | Create booking |
| PATCH | `/api/bookings/:id` | Update booking status (Admin) |
| DELETE | `/api/bookings/:id` | Cancel booking |

---

## 👤 Developer

**Ryan S. Carbonel**
- Portfolio: [https://portfolio-three-delta-dzyn1fzefk.vercel.app](https://portfolio-three-delta-dzyn1fzefk.vercel.app)
- GitHub: [https://github.com/Reffin](https://github.com/Reffin)
- LinkedIn: [https://www.linkedin.com/in/ryan-carbonel-a2240b1a0](https://www.linkedin.com/in/ryan-carbonel-a2240b1a0)

---

## 📄 License

MIT License — feel free to use this project as a reference or template!
