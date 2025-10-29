# apps/web/Dockerfile
FROM node:20-bullseye AS base
WORKDIR /app
FROM base AS development
# Copia root configs
COPY package.json package-lock.json turbo.json ./

# Copia workspaces
COPY apps/web/package.json ./apps/web/
COPY packages ./packages

# Instala dependências
RUN npm install

# Copia todo o restante
COPY . .

EXPOSE 3000
# CMD ["npm", "run", "dev"]
RUN npx turbo build --filter=web...
CMD ["npm", "--workspace=apps/web", "run", "dev"]
