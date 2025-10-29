# ---------- Base ----------
FROM node:18-alpine AS base
WORKDIR /app
ENV NODE_ENV=development

# ---------- Development ----------
FROM base AS development
RUN npm install -g @nestjs/cli

# Copia apenas o root e a pasta apps
COPY ../../package*.json ./
COPY ../../tsconfig*.json ./
COPY ../../turbo.json ./
COPY ../../apps ./apps
COPY ../../packages ./packages

# Instala apenas dependências
RUN npm install

# Gera build incremental do Turborepo (somente este serviço)
RUN npx turbo build --filter=api-gateway...
CMD ["npm", "--workspace=apps/api-gateway", "run", "dev"]
