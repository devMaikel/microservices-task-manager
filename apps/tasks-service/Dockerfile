FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=development

FROM base AS development
RUN npm install -g @nestjs/cli

COPY ../../package*.json ./
COPY ../../tsconfig*.json ./
COPY ../../turbo.json ./
COPY ../../apps ./apps
COPY ../../packages ./packages

RUN npm install

RUN npx turbo build --filter=tasks-service...
CMD ["npm", "--workspace=apps/tasks-service", "run", "dev"]
