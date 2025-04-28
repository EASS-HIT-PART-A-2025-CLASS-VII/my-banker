# 💰 MyBanker – Personal Financial Intelligence

🎯 **Project Purpose**  
This project was created for the Engineering of Advanced Software Solutions course at HIT.  
It aims to provide a personalized financial assistant that analyzes user data and delivers comprehensive reports — as if written by a private banker and senior accountant.

⚙️ **Tech Stack**  
- **Backend:** Node.js (Express)  
- **Authentication Service:** MongoDB  
- **AI Engine:** Planned  
- **Crypto Wallet Integration:** Planned  
- **Containerization:** Docker  
- **Testing:** Python (Pytest)  
- **Frontend:** React

🧩 **Architecture Overview**  
The system uses a modular monolith architecture — clear separation of services without microservices overhead:

```
my-banker/
│
├── backend/                     # Backend (Node.js + Express)
│   ├── api.js                   # Main Express server setup and routing
│   ├── database/                # Database connection logic
│   │   └── db.js
│   ├── services/                # Modular services
│   │   └── authentication/      # Authentication logic and routes
│   │       ├── authentication.js
│   │       ├── authenticationModel.js
│   │       └── authenticationRoutes.js
│   ├── views/                   # Pug templates for server-side rendering
│   │   └── index.pug
│   ├── package.json             # Backend dependencies and scripts
│   ├── package-lock.json        # Backend lock file
│   └── Dockerfile               # Dockerfile for containerizing the backend
│
├── frontend/                    # Frontend (React)
│   ├── public/                  # Public assets
│   │   ├── index.html           # Main HTML file
│   │   └── favicon.ico          # Favicon
│   ├── src/                     # React source files
│   │   ├── components/          # React components
│   │   │   ├── Login.js         # Login and MetaMask connection component
│   │   ├── App.js               # Main React app component
│   │   ├── index.js             # React entry point
│   │   ├── App.css              # Global styles
│   │   └── index.css            # Global styles
│   ├── package.json             # Frontend dependencies and scripts
│   ├── package-lock.json        # Frontend lock file
│   └── .env                     # Environment variables (e.g., API base URL)
│
├── tests/                       # Test files
│   ├── authentication/          # Authentication-related tests
│   │   ├── test_authentication.py # Pytest for backend authentication
│
├── utils/                       # Utility functions (e.g., error handling)
├── errors/                      # Centralized error definitions
├── docker-compose.yml           # Docker Compose configuration
└── README.md                    # Project documentation
```

✅ **Current Features**  
- 🟢 Base Express server running  
- 🟢 Modular authentication service created  
- 🟢 Project is structured for clarity, testing, and growth  

🔜 **Coming Soon**  
- AI-generated financial reports  
- Crypto wallet connection and analysis  
- Full frontend interface (React)  
- Dockerized project environment  
- Full authentication flow with JWT  


## ⚙️ Installation & Setup

### 📦 Prerequisites
- Docker installed on your machine  
- Node.js (if running without Docker)  
- Git for version control  

### 🔄 Clone the Repository
```bash
git clone https://github.com/EASS-HIT-PART-A-2025-CLASS-VII/my-banker
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
| POST   | /auth/send    | Send wallet information               |
| GET    | /auth/report  | Get personalized report               |


## 🤝 Contributing
We welcome contributions! Feel free to submit a pull request or open an issue.



## 📄 License
MIT License


