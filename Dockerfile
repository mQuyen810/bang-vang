# -------- deps --------
FROM dockerhub.viettelsoftware.com/bu01-reg/node-23-alpine AS deps
WORKDIR /app

# Install dependencies based on lockfile
COPY package.json package-lock.json ./
RUN npm ci

# -------- builder --------
FROM dockerhub.viettelsoftware.com/bu01-reg/node-23-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# -------- runner --------
FROM dockerhub.viettelsoftware.com/bu01-reg/node-23-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Next.js standalone build is not configured; run standard production start
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]

