# 🏥 Dialysis Session Intake & Anomaly Dashboard

## 📌 Overview

This project is a **full-stack dialysis session tracking system** built to assist healthcare staff in monitoring patient sessions and identifying potential anomalies in real time.

It enables:

* Patient registration
* Session tracking
* Automated anomaly detection
* Real-time dashboard for nurses

---

## 🧱 Tech Stack

**Frontend**

* React (TypeScript)
* Tailwind CSS

**Backend**

* Node.js + Express (TypeScript)

**Database**

* MongoDB (Mongoose)

---

## ⚙️ Architecture Overview

* **Frontend (React)** communicates with backend via REST APIs
* **Backend (Express)** handles:

  * Validation
  * Business logic (anomaly detection)
  * Data persistence
* **MongoDB** stores patients and session data

### Data Flow

Client → API → Controller → Service → DB → Response → UI

---

## 🧠 Clinical Assumptions & Trade-offs

Since thresholds were not specified, the following assumptions were made:

* **Weight Gain Threshold:** > 5% of dry weight
* **High Systolic BP:** > 180 mmHg
* **Session Duration:**

  * Too short: < 180 minutes
  * Too long: > 300 minutes

### Trade-offs

* Used simple thresholds instead of complex medical models
* Focused on clarity and configurability over clinical accuracy
* Config centralized in `anomalyConfig.ts`

---

## 📊 Features

### Backend

* Create patients
* Record dialysis sessions
* Detect anomalies
* Fetch today's schedule

### Frontend

* Dashboard with patient sessions
* Status indicators (not started / in progress / completed)
* Highlight anomalies
* Add session form
* Filter patients with anomalies

---

## 🧪 Testing

### Backend (curl examples)

```bash
# Create patient
curl -X POST http://localhost:5000/patients \
-H "Content-Type: application/json" \
-d '{"name":"John","age":50,"gender":"male","dryWeight":65,"unitId":"unit1"}'
```

---

## 🚀 How to Run

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🗂️ Project Structure

backend/

* models/
* controllers/
* routes/
* services/
* config/

frontend/

* components/
* pages/
* api/
* types/

---

## ⚠️ Failure Handling

* Handles missing fields with validation
* Graceful UI fallback for:

  * Loading states
  * Error states
  * Empty data
* Backend returns meaningful error messages

---

## 🔮 Future Improvements

* Authentication & role-based access
* Real-time updates (WebSockets)
* Advanced anomaly detection using ML
* Pagination and performance optimization

---

## 📸 Screenshots (Optional)

<img width="1919" height="944" alt="image" src="https://github.com/user-attachments/assets/9a6456ee-8c7b-430a-8427-97aeab4b4bcb" />


---

## 👨‍💻 Author

Built as part of a full-stack system design assignment.

---
