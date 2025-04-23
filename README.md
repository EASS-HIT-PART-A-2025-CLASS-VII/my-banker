# 💰 MyBanker – Personal Financial Intelligence

🎯 **Project Purpose**  
This project was created for the Engineering of Advanced Software Solutions course at HIT.  
It aims to provide a personalized financial assistant that analyzes user data and delivers comprehensive reports — as if written by a private banker and senior accountant.

⚙️ **Tech Stack**  
- **Backend:** Node.js (Express)  
- **Authentication Service:** MongoDB  
- **AI Engine:** Python (planned)  
- **Crypto Wallet Integration:** Planned  
- **Containerization:** Docker  
- **Testing:** Python (Pytest)  
- **Frontend:** React (planned)

🧩 **Architecture Overview**  
The system uses a modular monolith architecture — clear separation of services without microservices overhead:


my-banker/
│
├── api/                    # Main Express server setup and routing
│
├── services/
│   └── authentication/     # Authentication logic and routes
│       ├── authentication.js
│       ├── authenticationModel.js
│       └── authenticationRoutes.js
│
├── tests/                  # Python tests (Pytest)
├── utils/                  # Utility functions (e.g., error handling)
├── errors/                 # Centralized error definitions
└── README.md

✅ **Current Features**  
- 🟢 Base Express server running  
- 🟢 Modular authentication service created  
- 🟢 Project is structured for clarity, testing, and growth  

🔜 **Coming Soon**  
- AI-generated financial reports  
- Crypto wallet connection and analysis  
- Frontend interface (React)  
- Dockerized project environment  
- Full authentication flow with JWT  


## ⚙️ Installation & Setup

### 📦 Prerequisites
- Docker installed on your machine  
- Node.js (if running without Docker)  
- Git for version control  

### 🔄 Clone the Repository
```bash
git clone <repository-url>
cd my-banker
```

### 🐳 Run with Docker

**Build the Docker image:**
```bash
docker build -t my-banker .
```

**Run the container:**
```bash
docker run -p 8000:8000 my-banker
```

The server will be accessible at:  
[http://localhost:8000](http://localhost:8000)

### 🚀 Run Without Docker

**Install dependencies:**
```bash
npm install
```

**Start the server:**
```bash
npm start
```


## 📡 API Endpoints

| Method | Endpoint      | Description                           |
|--------|---------------|---------------------------------------|
| POST   | /auth/login   | Authenticate a user                   |
| POST   | /auth/upload  | Upload financial statements           |
| GET    | /auth/offers  | Get personalized credit offers        |
| GET    | /auth/chat    | AI-powered financial assistant        |


## 🤝 Contributing
We welcome contributions! Feel free to submit a pull request or open an issue.



## 📄 License
MIT License


