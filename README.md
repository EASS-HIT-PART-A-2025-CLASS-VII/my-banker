# 💰 MyBanker – Personal Financial Intelligence

![Logo](readmeFiles/Logo.png)

🎯 **Project Purpose**  
This project was created for the Engineering of Advanced Software Solutions course at HIT.  
It aims to provide a personalized financial assistant that analyzes user data and delivers comprehensive reports — as if written by a private banker and senior accountant.

---

## 🛠️ Tech Stack

- **Backend:** Node.js (Express)
- **Authentication Service:** MongoDB
- **AI Engine:** Gemma 3 LLM via Ollama
- **Crypto Wallet Integration:** Moralis API
- **Containerization:** Docker
- **Testing:** Jest
- **Frontend:** React

---

## 🏗️ Architecture Overview

![System Diagram](readmeFiles/Diagram.png)

---

## ✅ Features

- 🟢 Base Express server running  
- 🟢 Modular services  
- 🟢 Project is structured for clarity, testing, and growth  
- 🟢 Crypto wallet connection and analysis via Moralis API  
- 🟢 AI-generated financial reports using Gemma 3 LLM  
- 🟢 Dockerized project environment  
- 🟢 Full frontend interface (React)  
- 🟢 Full authentication flow with JWT  

---

## 📸 Screenshots

![Home Page](readmeFiles/HomePage.png)  

---

## ⚙️ Environment Variables & Configuration

### 🔒 Required Variables

You must set the following environment variables in your `docker-compose.yml`.

### 🛠️ How to Configure

Find the `environment:` section under the `backend` service in your `docker-compose.yml` file.  
Replace the placeholder values with your actual configuration:

```yaml
environment:
  - MONGO_URI=mongodb://mongo:27017/my-banker         # MongoDB connection string
  - OLLAMA_API=http://ollama:11434                    # Ollama service endpoint
  - JWT_SECRET=YOUR_SECURE_JWT_SECRET_HERE            # 64-character hex secret for JWT
  - MORALIS_API_KEY=YOUR_MORALIS_API_KEY_HERE         # Moralis API key
```

---

## 📝 Variable Reference Table

| Variable          | Required | Description                          | Example Value (for reference)         |
|------------------|----------|--------------------------------------|---------------------------------------|
| `MONGO_URI`      | Yes      | MongoDB connection string            | `mongodb://mongo:27017/my-banker`     |
| `OLLAMA_API`     | Yes      | Ollama service URL                   | `http://ollama:11434`                 |
| `JWT_SECRET`     | Yes      | 64-character hex secret for JWT      | `201fc9a67ef78be4d958f91bbad9f7d6...` |
| `MORALIS_API_KEY`| Yes      | Moralis Web3 API key                 | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ` |

---

### 🔐 Generating JWT Secret

**Recommended method:** Generate a 64-character secure secret using:

**Using OpenSSL**
```bash
openssl rand -hex 32
```

**Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET` value.

---

## 🚀 Installation & Setup

### 📦 Prerequisites

- **Docker** installed on your machine  
- **Node.js** (if running without Docker)  
- **Git** for version control  

### 🔄 Clone the Repository

```bash
git clone https://github.com/EASS-HIT-PART-A-2025-CLASS-VII/my-banker
cd my-banker
```

---

### 🐳 Run with Docker

**Build and start all services:**

```bash
docker-compose up --build
```

The backend will be accessible at:  
[http://localhost:8000](http://localhost:8000)

The frontend will be accessible at:  
[http://localhost:3000](http://localhost:3000)

---

### 🚀 Run Without Docker

**Install dependencies:**

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

**Start the backend:**

```bash
cd backend
npm start
```

**Start the frontend:**

```bash
cd frontend
npm start
```

---

## 📡 RESTful API Usage

**Base URL:**  
`http://localhost:8000`

### Authentication

- **How to authenticate:**  
  - Use JWT in the `Authorization` header: `Bearer <token>`  
  - Obtain a token via `/auth/login`

---

### Endpoints

| Method | Endpoint                        | Description                                 | Authentication |
|--------|----------------------------------|---------------------------------------------|----------------|
| POST   | `/auth/login`                    | User login                                  | No             |
| POST   | `/auth/register`                 | User registration                           | No             |
| PATCH  | `/auth/update`                   | Update user info                            | Yes (JWT)      |
| PATCH  | `/auth/updateEmail`              | Update user email                           | Yes (JWT)      |
| PATCH  | `/auth/updatePassword`           | Update user password                        | Yes (JWT)      |
| PATCH  | `/auth/updatePreferences`        | Update user preferences                     | Yes (JWT)      |
| DELETE | `/auth/delete`                   | Delete user account                         | Yes (JWT)      |
| POST   | `/report`                        | Generate a personalized report              | Yes (JWT)      |
| GET    | `/user/preferences/:username`    | Get user preferences by username            | Yes (JWT)      |

---

### Example Requests

**1. User Login**
```bash
curl -X POST http://localhost:8000/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"user1", "password":"pass123"}'
```

**2. Generate Report**
```bash
curl -X POST http://localhost:8000/report \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" \
-d '{"walletAddress":"0x123...", "chain":"ethereum"}'
```

**3. Get User Preferences**
```bash
curl -X GET http://localhost:8000/user/preferences/user1 \
-H "Authorization: Bearer <your-token>"
```

---

### Example Responses

**Successful Login**
```json
{
  "status": 200,
  "data": {
    "type": "Success",
    "message": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response**
```json
{
  "status": 401,
  "error": {
    "type": "Unauthorized",
    "message": "Invalid credentials"
  }
}
```

---

### Error Handling

| Code | Message               |
|------|-----------------------|
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 404  | Not Found             |
| 500  | Internal Server Error |

> You can use tools like **Postman** or **Swagger** to test the endpoints interactively.

---

## 🧪 Testing

To run tests:

```bash
npm test
```

---

## 🤝 Contributing

We welcome contributions! Feel free to submit a pull request or open an issue.

---

## 📄 License

MIT License