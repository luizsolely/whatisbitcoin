# ══════════════════════════════════════════════════
#  STAGE 1 — Build Angular
# ══════════════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first (layer cache)
COPY package.json ./

# Install all dependencies (Angular CLI fica em node_modules/.bin)
RUN npm install

# Copy all source files
COPY . .

# Build usando o ng local do node_modules
RUN ./node_modules/.bin/ng build --configuration production

# ══════════════════════════════════════════════════
#  STAGE 2 — Serve with Nginx
# ══════════════════════════════════════════════════
FROM nginx:1.25-alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app from Stage 1
COPY --from=builder /app/dist/whatisbitcoin/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
