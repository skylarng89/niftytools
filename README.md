# NiftyTools - Microservices Architecture

A collection of developer utility tools built with a **microservices architecture**. Each tool runs as an independent service that can be deployed, scaled, and maintained separately. Call it a developers Swiss Army Knife.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│         User Frontend (Vue 3)           │
│          Port: 5173 / 80                │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         API Gateway (Express)           │
│            Port: 3000                   │
└──────────┬──────────────────────────────┘
           │
    ┌──────┴──────┬──────────────────┐
    │             │                  │
┌───▼───┐    ┌───▼────┐      ┌─────▼─────┐
│ Text  │    │ Future │      │  Future   │
│ Tools │    │ Service│      │  Service  │
│       │    │        │      │           │
│:3001  │    │:3002   │      │  :3003    │
└───────┘    └────────┘      └───────────┘
```

### Components

**Frontend**
- **User Frontend**: Vue 3 SPA with Tailwind CSS
- Communicates with backend via API Gateway
- Built with Vite for fast development and optimized production builds

**Backend Services**
- **API Gateway**: Routes requests to appropriate microservices
- **Text Tools Service**: Text sorting, manipulation, and export features
- **Future Services**: Each new tool becomes its own microservice

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v24 or higher (for Gateway and Frontend)
- **Python**: v3.11 or higher (for Backend Services)
- **npm**: v10 or higher
- **Docker** (optional): For containerized deployment

### Local Development (Without Docker)

#### 1. Install Dependencies

```bash
# Gateway
cd services/gateway
npm install

# Text Tools Service (Python)
cd ../text-tools-service-py
pip install -r requirements.txt

# Frontend
cd ../../frontend
npm install
```

#### 2. Start Services

Use the deployment scripts for easier management:

```bash
# Development mode
./dev.sh

# Or manually in 3 terminals:
# Terminal 1: Gateway
cd services/gateway
npm run dev     # Runs on http://localhost:3000

# Terminal 2: Text Tools Service (Python)
cd services/text-tools-service-py
python -m uvicorn src.main:app --host 0.0.0.0 --port 3001 --reload

# Terminal 3: Frontend
cd frontend
npm run dev     # Runs on http://localhost:5173
```

#### 3. Access the Application

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:3000
- **Text Tools Service**: http://localhost:3001

### Docker Deployment (Production)

Use the deployment scripts for production:

```bash
# Production deployment
./prod.sh

# View logs
docker compose logs -f

# Stop services
./stop.sh

# Check status
./status.sh
```

Or use Docker Compose directly:

```bash
# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Stop services
docker compose down -v
```

**Access the application:**
- **Frontend**: http://localhost:80
- **API Gateway**: http://localhost:3000
- **Text Tools Service**: http://localhost:3001

**Production features:**
- ✅ Health checks and auto-restart
- ✅ Resource limits (CPU & memory)
- ✅ Non-root users for security
- ✅ Optimized images (~350MB total)
- ✅ Logging with rotation

## 📝 Logging

All services now include centralized logging with daily rotation and configurable log levels:

- **Location**: `logs/` directory with service-specific subdirectories
- **Format**: `{service}-{YYYY-MM-DD}.log` with ISO timestamps
- **Levels**: INFO, WARN, ERROR, DEBUG (configurable via `LOG_LEVEL` environment variable)
- **Rotation**: Daily rotation with 7-day retention
- **Frontend**: Logs sent to backend services via API

### Log Levels

Set the `LOG_LEVEL` environment variable to control verbosity:

- **DEBUG**: All logs including detailed debug information
- **INFO**: General information about application operation (default)
- **WARN**: Warning conditions that don't stop execution
- **ERROR**: Error conditions that may affect functionality

Example `.env` configuration:
```bash
LOG_LEVEL=DEBUG  # Show all logs
LOG_LEVEL=INFO   # Show info, warn, and error logs (default)
LOG_LEVEL=WARN   # Show only warn and error logs
LOG_LEVEL=ERROR  # Show only error logs
```

### Viewing Logs

```bash
# View all logs
tail -f logs/*/*.log

# View specific service logs
tail -f logs/gateway/gateway-*.log
```

See `logs/VIEWING_LOGS.md` for detailed logging documentation.

### Stopping Services

```bash
# Docker (production)
docker compose down

# Local development
Ctrl+C in each terminal (or use ./start-all.sh script)
```

## 📁 Project Structure

```
niftytools/
├── gateway/                    # API Gateway service
│   ├── src/
│   │   └── index.ts           # Gateway server
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── text-tools-service/         # Text Tools microservice
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper functions
│   │   ├── types/             # TypeScript types
│   │   ├── routes.ts          # Route definitions
│   │   └── index.ts           # Service entry point
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── apps/
│   └── user-frontend/         # Vue 3 frontend application
│       ├── src/
│       │   ├── components/    # Reusable Vue components
│       │   ├── views/         # Page components
│       │   ├── router/        # Vue Router configuration
│       │   └── main.ts
│       ├── Dockerfile
│       ├── nginx.conf         # Nginx configuration
│       ├── package.json
│       └── .env.example
│
├── docker-compose.yml          # Production orchestration
├── docker-compose.dev.yml      # Development orchestration
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## 🔧 Configuration

### Environment Variables

#### Gateway (.env)
```bash
PORT=3000
TEXT_TOOLS_SERVICE_URL=http://text-tools-service:3001
NODE_ENV=development
```

#### Text Tools Service (.env)
```bash
PORT=3001
NODE_ENV=development
```

#### User Frontend (.env)
```bash
VITE_API_GATEWAY_URL=http://localhost:3000
```

## 🛠️ Available Tools

### Text Tools (Port 3001)

**Sort Text** - Advanced text sorting with multiple algorithms:
- Alphabetical (A-Z, Z-A)
- Natural sorting (handles numbers: "item2" < "item10")
- Length-based sorting
- Reverse order
- Random shuffle

**Features**:
- File upload support (TXT, CSV up to 10MB)
- Processing options: case sensitivity, remove empty lines, remove duplicates
- Export to CSV (simple or comparison format)
- Real-time statistics

## 🏗️ Adding New Services

To add a new tool as a microservice:

1. **Create Service Directory**
```bash
mkdir my-new-service
cd my-new-service
npm init -y
```

2. **Setup Service**
- Create `src/index.ts` with Express server
- Add routes and controllers
- Create Dockerfile

3. **Register in Gateway**
Update `services/gateway/src/index.ts`:
```typescript
app.use('/api/my-new-service', createProxyMiddleware({
  target: process.env.MY_NEW_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: { '^/api/my-new-service': '' }
}));
```

4. **Update Docker Compose**
Add service to `docker-compose.yml`:
```yaml
my-new-service:
  build: ./my-new-service
  ports:
    - "3002:3002"
  environment:
    - NODE_ENV=production
```

## 🧪 API Documentation

### Text Tools Service

#### Sort Text
```bash
POST /api/text-tools/sort
Content-Type: application/json

{
  "text": "line1\nline2\nline3",
  "method": "alphabetical-asc",
  "options": {
    "caseSensitive": false,
    "removeEmpty": true,
    "removeDuplicates": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "originalText": "...",
    "processedText": "...",
    "method": "alphabetical-asc",
    "stats": {
      "originalLines": 3,
      "processedLines": 3,
      "processingTime": 5
    }
  }
}
```

#### Export CSV
```bash
POST /api/text-tools/export/csv
Content-Type: application/json

{
  "originalText": "...",
  "processedText": "...",
  "method": "alphabetical-asc",
  "format": "simple"
}
```

**Response:** CSV file download

## 🔒 Service Independence

Each service can be:
- **Built independently**: Changes to one service don't require rebuilding others
- **Deployed independently**: Deploy only the services that changed
- **Scaled independently**: Scale services based on their individual load
- **Taken offline**: Other services continue functioning

## 🐳 Docker Build Optimization

Each service uses multi-stage builds for:
- Fast build times with layer caching
- Small production images
- No unnecessary dependencies in production

**Build specific service:**
```bash
docker build -t gateway ./services/gateway
docker build -t text-tools-service ./services/text-tools-service
docker build -t frontend ./frontend
```

## 📊 Health Checks

Each service provides a health check endpoint:

```bash
# Gateway
curl http://localhost:3000/health

# Text Tools Service
curl http://localhost:3001/health
```

**Response:**
```json
{
  "status": "ok",
  "service": "text-tools-service",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## 🎨 Frontend Development

The frontend is built with:
- **Vue 3**: Composition API with TypeScript
- **Vite**: Fast HMR and optimized builds
- **Tailwind CSS**: Utility-first styling
- **Vue Router**: Client-side routing

### Development Server
```bash
cd frontend
npm run dev
```

Visit http://localhost:5173

### Production Build
```bash
npm run build
npm run preview
```

## 🚦 Development Workflow

### Starting Development (Recommended)

Use the **manual setup** for development (faster, simpler, better debugging):

```bash
# Option 1: Use the start script
./start-all.sh

# Option 2: Manual in 3 terminals
cd services/gateway && npm run dev
cd services/text-tools-service && npm run dev
cd frontend && npm run dev
```

### Making Changes
- **Gateway**: Changes auto-reload via `tsx watch`
- **Services**: Changes auto-reload via `tsx watch`
- **Frontend**: HMR via Vite
- **No Docker rebuilds needed** - instant feedback!

### Building for Production

```bash
# Build Docker images
docker compose build

# Or build individually
cd services/gateway && npm run build
cd services/text-tools-service && npm run build
cd frontend && npm run build
```

### Deployment

```bash
# Deploy to production
docker compose up -d

# Update a service
docker compose up -d --build gateway

# View logs
docker compose logs -f gateway
```

## 🔄 Migration from Monorepo

This project was migrated from a monorepo architecture to microservices for:
- **Better isolation**: Each service is completely independent
- **Faster builds**: No need to rebuild everything for small changes
- **Simpler deployment**: Deploy only what changed
- **Clearer boundaries**: Each tool is its own codebase

## 📝 Memory Bank

Project documentation and architecture details are maintained in the `memory-bank/` directory for context preservation across development sessions.

## 🤝 Contributing

1. Create a new service directory for new tools
2. Follow the existing service structure
3. Add appropriate Docker configuration
4. Update the gateway routes
5. Document API endpoints

## 📄 License

MIT License

---

**Built with ❤️ using modern microservices architecture**
