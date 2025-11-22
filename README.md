# Microservices Task Manager

Monorepo em Turborepo com microserviços NestJS e frontend React, oferecendo autenticação, gerenciamento de tarefas, comentários e notificações em tempo real.

**Apps**

- `apps/api-gateway` — HTTP API, Swagger, validação e rate limit.
- `apps/auth-service` — microserviço de usuários (JWT, refresh token, Postgres).
- `apps/tasks-service` — microserviço de tarefas e comentários (Postgres, RMQ).
- `apps/notifications-service` — consumo de eventos e WebSocket (Socket.IO).
- `apps/web` — frontend React + TanStack Router/Query.

**Packages**

- `packages/ui` — componentes React compartilhados.
- `packages/types` — tipos compartilhados.
- `packages/eslint-config` e `packages/typescript-config` — configuração base.

## Arquitetura

![Diagrama da arquitetura](https://github.com/devMaikel/microservices-task-manager/blob/main/docs/arquitetura.png)

## Decisões Técnicas e Trade-offs

- React tanstack Query para cache e invalidação simples e previsível ao receber notificações.
- TanStack Router: rotas baseadas em arquivos.
- Turborepo: desenvolvimento e build paralelos.
- Rate limiting: `@nestjs/throttler` global (10 req/seg) no gateway. Simples e eficaz, mas sem granularidade por IP por padrão.

## Problemas Conhecidos e Melhorias

- Observabilidade: totalmente ausente no projeto atualmente.
- Segurança: reforçar rate limit por IP/rota.

## Tempo Gasto (estimativa)

- Arquitetura e setup do monorepo: 4h
- API Gateway (Swagger, validação, CORS): 8h
- Rate limiting: 1h
- Auth Service (JWT, refresh, DB): 8h
- Tasks Service (tarefas, comentários, DB, RMQ): 12h
- Notifications Service (RabbitMQ, Socket.IO): 8h
- Frontend (Rotas, Query, notifs em tempo real, toasts): 8h
- Documentação e melhorias: 2h

Total aproximado: 51h

## Instruções de Execução

**Pré-requisitos**

- Docker

**Variáveis de ambiente recomendadas**

- Já configuradas no `docker-compose.yml`

**Subir infraestrutura com Docker**

- Instalar deps na raiz do projeto: `npm install`
- `docker compose up -d`

**Rodar serviços individualmente (desenvolvimento)**

- Instalar deps: `npm install`
- Auth Service: `npm --workspace=apps/auth-service run dev`
- Tasks Service: `npm --workspace=apps/tasks-service run dev`
- Notifications Service: `npm --workspace=apps/notifications-service run dev`
- API Gateway: `npm --workspace=apps/api-gateway run start:dev`
- Web (frontend): `npm --workspace=apps/web run dev` e abrir `http://localhost:3000/`

**Fluxo de validação**

- Login no frontend para iniciar WS.
- Criar/atualizar tarefas: UI deve refazer fetch automaticamente (Tanstack/React Query).
- Adicionar comentário em uma tarefa aberta em outra sessão: lista de comentários deve atualizar via notificação `comment:new`.
- Rate limit: fazer >10 requisições em 1 segundo no gateway → deve retornar `429`.
