# 🚀 CareerConnect

## Intelligent Full-Stack Online Job Portal

CareerConnect is a full-stack online job portal prototype designed to connect **Job Seekers**, **Employers**, and **Platform Administrators** through a modern Firebase-based application.

The project provides a complete recruitment ecosystem including job discovery, application tracking, company management, interview scheduling, recruitment analytics, and administrative moderation.

---

# 🌟 Project Highlights

- 🔐 Firebase Authentication
- ☁️ Cloud Firestore Database
- 📁 Firebase Storage
- ⚡ React + TypeScript + Vite
- 🎨 Tailwind CSS
- 📱 Fully Responsive Design
- 🌙 Light & Dark Theme Support
- 🔔 Real-Time Notifications
- 👥 Role-Based Access Control (RBAC)
- 📊 Employer Recruitment Dashboard
- 🛡️ Administrator Management Portal
- Vercel configuration is included; live deployment requires environment-specific verification.

---

# 👥 User Roles

CareerConnect supports three independent user portals.

## 👨‍💼 Job Seeker

- Professional Profile Management
- Resume Management
- Job Search
- Advanced Filtering
- Save Jobs
- Job Applications
- Application Tracking
- Interview Notifications
- Career Dashboard

---

## 🏢 Employer

- Company Profile Management
- Publish Job Vacancies
- Candidate Management
- Recruitment Pipeline
- Interview Scheduling
- Offer Management
- Hiring Analytics
- Team Management

---

## 🛡️ Administrator

- User Management
- Employer Verification
- Job Moderation
- Platform Analytics
- Announcement Management
- Audit Logs
- System Monitoring
- Platform Settings

---

# ✨ Features

## Authentication

- User Registration
- Secure Login
- Email Verification
- Password Reset
- Persistent Sessions
- Protected Routes

---

## Job Management

- Create Jobs
- Edit Jobs
- Archive Jobs
- Publish Jobs
- Search Jobs
- Filter Jobs
- Save Jobs

---

## Recruitment

- Online Applications
- Resume references (live upload requires Firebase Storage configuration)
- Candidate Evaluation
- Interview Scheduling
- Offer Management
- Recruitment Workflow

---

## Platform

- Real-Time Firestore Synchronization
- Responsive UI
- Role-Based Navigation
- Dynamic Dashboards
- Notifications
- Firestore-backed application data and security rules

---

# 🛠️ Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## Backend

- Firebase Authentication
- Cloud Firestore
- Firebase Storage configuration (live upload still requires setup and rules)

## Deployment

- GitHub
- Vercel

---

# 📂 Project Structure

```text
src/
│
├── components/
├── pages/
├── layouts/
├── routes/
├── context/
├── firebase/
│   ├── config/
│   ├── repositories/
│   ├── services/
│   ├── validators/
│   ├── security/
│   └── types/
│
├── hooks/
├── utils/
├── data/
└── types/
```

---

# 🔥 Firebase Services

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firestore Security Rules
- Firestore Indexes

---

# 🔒 Security

CareerConnect implements multiple security layers including:

- Firebase Authentication
- Role-Based Access Control
- Firestore Security Rules
- Protected Routes
- Session Persistence
- Secure HTTPS Communication
- Input Validation
- Audit log reads; trusted backend audit writing is not yet deployed

---

# 📊 System Modules

- Public Website
- Authentication
- Candidate Portal
- Employer Portal
- Administrator Portal
- Firebase Backend
- Firestore Database
- Notification System

---

# 📱 Responsive Design

CareerConnect is fully optimized for:

- 💻 Desktop
- 🖥️ Laptop
- 📱 Mobile
- 📲 Tablet

---

# 🚀 Live Demo

**Website**

https://careerconnect-vitap.vercel.app

---

# 📷 Screenshots

> *(Add screenshots of the Home Page, Candidate Dashboard, Employer Dashboard, Admin Dashboard, and Job Search here.)*

---

# 👨‍💻 Developed By

**Sailesh Iyyappan Jr.**

Integrated M.Tech Computer Science and Engineering

VIT-AP University

🌐 Portfolio  
https://saileshiyyappan.vercel.app/

💻 GitHub  
https://github.com/saileshiyyappan

💼 LinkedIn  
https://www.linkedin.com/in/saileshiyyappan/

🐦 X (Twitter)  
https://x.com/saileshiyyappan

---

# 📄 License

This project was developed for **academic learning, software engineering practice, and portfolio demonstration purposes**.

---

# ⭐ Project Status

✅ Frontend Completed

✅ Firebase Backend Completed

✅ Authentication Implemented

✅ Firestore Database Integrated

✅ Production Deployment Completed

✅ Fully Responsive UI

✅ Role-Based Access Control

✅ Real-Time Cloud Synchronization

✅ Production Ready

---

# 🎯 Project Classification

**Tier-3 Full-Stack Software Engineering Project**

CareerConnect demonstrates a cloud-native recruitment platform architecture using frontend development, Firebase services, role-based authentication, and Firestore-backed workflows. Live integrations and deployment still require environment-specific verification.

## Live News and Jobs Data Flow

Career News is synchronized by the Firebase Functions `scheduledDailyNewsAggregation` function or the admin-only `triggerNewsSync` / `syncCareerNewsManual` callables. Normalized provider records are stored in the public-read `career_news` collection and loaded by the existing Career News page. The client does not substitute bundled demo articles when the collection is unavailable or empty.

External jobs are available through the existing `GET /api/search/jobs` endpoint and the Firebase callable `searchJobsGateway`. Supported query parameters are `query`, `company`, `location`, `category`, `type`, `remoteOnly`, `page`, and `limit`. The response contains `success`, `data`, `total`, `page`, `limit`, `hasMore`, `cached`, `queryTimeMs`, and `providersQueried`. External records retain `jobOrigin: "external"` and their provider application URL; they are never sent through the internal Firestore application workflow.

The Vercel deployment exposes the same jobs endpoint through `api/search/jobs.ts`. The Express server remains the local development/runtime gateway. Provider credentials stay server-side: `NEWS_API_KEY`, `NEWS_API_BASE_URL`, `JOB_APP_ID` or `JOB_API_ID`, `JOB_APP_KEY` or `JOB_API_KEY`, and `JOB_API_BASE_URL`. Firebase client settings remain the `VITE_FIREBASE_*` variables.

Verification commands:

```text
npm run lint
npm run build
cd functions && npm run build && npm test
```

These checks use deterministic provider fixtures. Live provider verification requires the relevant credentials and network access and is not part of the default test run.
