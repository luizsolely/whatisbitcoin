# ₿ whatisbitcoin.com

Educational website about the history and evolution of Bitcoin, with real-time market data and price alerts.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 17 |
| price-service | Spring Boot 3 + WebClient |
| notification-service | Spring Boot 3 + Spring AMQP + WebSocket |
| Cache | Redis |
| Database | PostgreSQL |
| Messaging | RabbitMQ |
| Email | Spring Mail (SendGrid / Gmail SMTP) |
| Containers | Docker Compose |

## Structure

```
whatisbitcoin/
├── frontend/                  # Angular app
├── backend/
│   ├── price-service/         # Fetches prices, caches in Redis, publishes to RabbitMQ
│   └── notification-service/  # Consumes RabbitMQ, delivers WebSocket + email
├── docker-compose.yml         # Full stack orchestration
└── .github/workflows/         # CI/CD
```

## Running locally

```bash
# Full stack
docker compose up --build

# Frontend only
cd frontend && docker compose up --build
```

## Services

| Service | Port |
|---|---|
| Frontend | http://localhost:4200 |
| price-service | http://localhost:8080 |
| notification-service | http://localhost:8081 |
| RabbitMQ dashboard | http://localhost:15672 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |
