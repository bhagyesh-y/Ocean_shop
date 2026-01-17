# 🌊 Ocean Shop – Full Stack E-Commerce Solution

Ocean Shop is a professional, full-stack e-commerce platform built with a decoupled architecture. It utilizes **React (Vite)** for a fast, responsive frontend and **Django REST Framework (DRF)** for a robust, API-driven backend.

---

## 🔗 Live Demo

- **Frontend (Vercel):** [https://ocean-shop-one.vercel.app](https://ocean-shop-one.vercel.app)
- **Backend API (Render):** [https://ocean-shop-r4s4.onrender.com](https://ocean-shop-r4s4.onrender.com)

---

## 🛠️ Tech Stack

### Frontend

- **Core:** React 18 (Vite), JavaScript (ES6+)
- **Routing:** React Router DOM
- **State Management:** Hooks & Context API
- **Styling:** CSS3 & Responsive Design

### Backend

- **Framework:** Django 5.x & Django REST Framework (DRF)
- **Authentication:** JWT (SimpleJWT) & dj-rest-auth
- **Database:** PostgreSQL (Production), SQLite (Development)
- **Payments:** Razorpay Integration
- **Storage:** Cloudinary (Images/Media)
- **Emails:** SendGrid API
- **PDF Logic:** xhtml2pdf & pypdf for Invoicing

---

## ✨ Key Features

- **Secure Authentication:** JWT-based login, registration, and social auth support.
- **Payment Gateway:** Secure checkout flow powered by **Razorpay**.
- **Cloud Media Management:** Image hosting and uploads via **Cloudinary**.
- **Automated Invoicing:** Generates professional PDF invoices using `xhtml2pdf`.
- **Product Management:** Dynamic product listing, details, and category filtering.
- **Email Notifications:** Order confirmations and communication via **SendGrid**.
- **Responsive UI:** Fully optimized for mobile, tablet, and desktop views.

---

## 📂 Project Structure

```text
OCEAN_SHOP/
├── frontend/             # React Vite Application
├── ocean_backend/        # Django REST Framework Backend
├── invoices/             # Directory for generated PDF invoices
├── media/                # Local media storage (Dev)
├── .venv/                # Virtual environment
├── build.sh              # Deployment script for Render
├── render.yaml           # Infrastructure configuration
├── vercel.json           # Vercel deployment settings
├── requirements.txt      # Python dependencies
└── README.md             # Project documentation

1. Clone the Repository

git clone [https://github.com/yourusername/ocean-shop.git](https://github.com/yourusername/ocean-shop.git)
cd OCEAN_SHOP

2. Backend Setup

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver

3. Frontend Setup

cd frontend

# Install dependencies
npm install

# Start development server
npm run dev


MIT License

Copyright (c) 2026 Bhagyesh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```
