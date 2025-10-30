FROM node:20-bullseye AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY apps/web/package*.json ./apps/web/
WORKDIR /app/apps/web
RUN npm install

WORKDIR /app
COPY . .

EXPOSE 3000

WORKDIR /app/apps/web
CMD ["npm", "run", "dev"]