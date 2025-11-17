# 1️⃣ Base image avec Node.js et Playwright
FROM apify/actor-node-playwright-chrome:20 AS builder

WORKDIR /app

# Copier package.json seulement
COPY package*.json ./

# Installer les dépendances avec root pour éviter les permissions
USER root
RUN npm install --include=dev --audit=false
USER myuser

# Copier le reste du code source
COPY --chown=myuser:myuser . .

# Builder TypeScript si nécessaire
RUN npm run build

# 2️⃣ Image finale
FROM apify/actor-node-playwright-chrome:20

WORKDIR /app

# Copier le build
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Installer seulement les dépendances de prod
USER root
RUN npm install --omit=dev --omit=optional
USER myuser

# Copier le reste du code
COPY --chown=myuser:myuser . .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
