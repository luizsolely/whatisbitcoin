# ₿ whatisbitcoin.com

An educational fullstack web application dedicated to the history, technology, and real-time market data of Bitcoin.

Built as a portfolio project to demonstrate modern fullstack development with Angular, Spring Boot, RabbitMQ, Redis, and PostgreSQL.

---

## Live Demo

> Frontend: https://wib-frontend-ta9i.onrender.com  
> Market: https://wib-frontend.onrender.com/market

---

## Stack

### Frontend
- **Angular 17** — Standalone components, lazy-loaded routes
- **Chart.js** — Interactive price history chart
- **WebSocket** — Live price ticker via `wss://`
- **Nginx** — Static file serving

### Backend
- **Spring Boot 4** — REST API and scheduled tasks
- **Spring AMQP** — RabbitMQ message publishing and consumption
- **Spring WebSocket** — Live price broadcast to connected clients
- **Spring Data JPA** — PostgreSQL persistence with Flyway migrations
- **Spring Data Redis** — Price caching with TTL
- **WebClient (WebFlux)** — Non-blocking HTTP calls to CoinGecko API

### Infrastructure
- **PostgreSQL** — Price snapshots and alert persistence
- **Redis** — Current price cache (60s TTL)
- **RabbitMQ** — Event-driven messaging between services
- **Docker / Docker Compose** — Containerized local development
- **Render** — Cloud deployment
- **SendGrid** — Transactional email delivery

---

## Architecture

```
CoinGecko API
      │
      ▼ (every 4 min via @Scheduled)
price-service
      ├── Redis         (cache current price)
      ├── PostgreSQL    (persist price snapshots + alerts)
      └── RabbitMQ ──► notification-service
                              ├── WebSocket ──► Angular (live ticker)
                              └── SendGrid  ──► Email (price alerts)
```

### Services

| Service | Responsibility |
|---|---|
| `price-service` | Fetches Bitcoin price from CoinGecko, caches in Redis, persists snapshots, checks and triggers price alerts, publishes events to RabbitMQ |
| `notification-service` | Consumes RabbitMQ events, broadcasts price via WebSocket, sends alert emails via SendGrid HTTP API |

---

## Features

### Landing Page (`/`)
- Full-viewport hero with animated Bitcoin particle system on Canvas
- Bitcoin history timeline from 2008 to 2024
- Technology explainer — Decentralization, Blockchain, Proof of Work, Halving
- Global impact section

### Market Page (`/market`)
- **Live price ticker** via WebSocket — updates every 4 minutes
- **Stats cards** — Market cap, 24h volume, price, 24h change
- **Interactive price chart** — Chart.js with 1H / 24H / 7D periods
- **Price alert form** — Register email + target price + direction (above/below), receive email notification when triggered

---

## Project Structure

```
whatisbitcoin/
├── frontend/                        # Angular 17 app
│   ├── src/app/
│   │   ├── home/                    # Landing page component
│   │   ├── market/                  # Market page component
│   │   ├── services/
│   │   │   └── price.service.ts     # WebSocket + HTTP client
│   │   ├── app.component.ts         # Router shell
│   │   └── app.routes.ts            # Route definitions
│   ├── nginx.conf                   # Nginx config
│   └── Dockerfile                   # Multi-stage build
│
├── backend/
│   ├── price-service/               # Spring Boot — port 8080
│   │   └── src/main/
│   │       ├── java/.../
│   │       │   ├── config/          # RabbitMQ, Redis config
│   │       │   ├── controller/      # REST endpoints
│   │       │   ├── dto/             # Data transfer objects
│   │       │   ├── model/           # JPA entities
│   │       │   ├── repository/      # Spring Data repositories
│   │       │   ├── scheduler/       # @Scheduled price fetch
│   │       │   └── service/         # Business logic
│   │       └── resources/
│   │           ├── application.yml
│   │           └── db/migration/    # Flyway SQL migrations
│   │
│   └── notification-service/        # Spring Boot — port 8081
│       └── src/main/
│           ├── java/.../
│           │   ├── config/          # RabbitMQ, WebSocket config
│           │   ├── consumer/        # RabbitMQ listeners
│           │   ├── service/         # Email service
│           │   └── websocket/       # WebSocket handler
│           └── resources/
│               └── application.yml
│
├── docker-compose.yml               # Full local orchestration
├── render.yaml                      # Render deployment config
├── .env.example                     # Environment variables template
└── .github/workflows/ci.yml         # GitHub Actions CI
```

---

## Running Locally

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for frontend development)
- Java 21 + Maven (for backend development)

### Start everything

```bash
# Clone
git clone https://github.com/seu-usuario/whatisbitcoin.git
cd whatisbitcoin

# Create .env from template
cp .env.example .env
# Edit .env with your credentials

# Start all services
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:4200 |
| price-service | http://localhost:8080 |
| notification-service | http://localhost:8081 |
| RabbitMQ dashboard | http://localhost:15672 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

### Frontend only (development)

```bash
cd frontend
npm install
ng serve
```

---

## Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```bash
MAIL_FROM=your-verified@email.com
MAIL_PASSWORD=SG.your_sendgrid_api_key
```

For the price-service, set in your environment or Render dashboard:

```bash
COINGECKO_API_KEY=CG-your_demo_api_key
```

---

## API Endpoints

### price-service (`/api/price`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/price/current` | Current Bitcoin price (from Redis cache) |
| `GET` | `/api/price/history?days=1` | Price history — accepts `0.04167` (1h), `1` (24h), `7` (7d) |
| `POST` | `/api/price/alerts` | Register a price alert |

**Alert request body:**
```json
{
  "email": "user@example.com",
  "targetPrice": 100000,
  "direction": "ABOVE"
}
```

### notification-service

| Protocol | Endpoint | Description |
|---|---|---|
| `WebSocket` | `/ws/price` | Live price stream |

---

## Deployment

The project is deployed on **Render** using the `render.yaml` blueprint.

- Frontend → Static Site (CDN, always on, free)
- price-service → Web Service (Docker)
- notification-service → Web Service (Docker)
- PostgreSQL → Render Managed Database
- Redis → Render Managed Redis
- RabbitMQ → CloudAMQP (Little Lemur free tier)
- Email → SendGrid HTTP API

---

## License

MIT
