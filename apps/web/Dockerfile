FROM node:20-alpine AS base
WORKDIR /app/apps/web
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

FROM base AS development
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]
