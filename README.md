![Tela inicial](docs/imgs/Captura%20de%20tela%202026-01-05%20145747.png)
![Carrinho](docs/imgs/Captura%20de%20tela%202026-01-05%20145814.png)
![Lista de desejos](docs/imgs/Captura%20de%20tela%202026-01-05%20145823.png)
![Pagina de Usuários](docs/imgs/Captura%20de%20tela%202026-01-05%20145844.png)
![Endereços](docs/imgs/Captura%20de%20tela%202026-01-05%20145852.png)

---
English version
---------------

This repository contains a NestJS backend (MySQL/TypeORM) and a Next.js frontend.

Summary
- Overview
- Project structure
- Prerequisites
- Running with Docker Compose
- Running locally (dev)
- Important environment variables
- Useful endpoints
- Avatar upload
- Notes and troubleshooting

Overview
--------

E-commerce project with:
- Backend: `backend/ecommerce-nestjs` (NestJS + TypeORM + MySQL)
- Frontend: `frontend/ecommerce-nextjs` (Next.js + React)

Main structure
--------------

- `backend/ecommerce-nestjs`: NestJS code, TypeORM entities in `src/typeorm/entities`.
- `frontend/ecommerce-nextjs`: Next.js application (app dir) and components in `src/components`.
- `docker-compose.yml`: orchestrates containers (MySQL, frontend, backend).
- `frontend/ecommerce-nextjs/public/userAvatar`: folder where avatar uploads are stored and served by Next.

Prerequisites
-------------

- Docker & Docker Compose (recommended for local testing)
- Node.js (if you prefer running services locally without Docker)
- NPM / PNPM / Yarn

Running with Docker Compose (recommended)
---------------------------------------

The `docker-compose.yml` in the repository root defines services:
- `db` (MySQL 8) on host port `3001` (container 3306)
- `nest` (backend) on host port `3000`
- `next` (frontend) on host port `5173`

To start everything:
```bash
docker-compose up --build -d
```

View logs:
```bash
docker-compose logs -f
```

Stop and remove:
```bash
docker-compose down
```

Exposed ports (host → container):
- `3001` → MySQL (3306)
- `3000` → Backend (NestJS)
- `5173` → Frontend (Next.js)

Running locally (without Docker)
--------------------------------

Backend (NestJS):
```bash
cd backend/ecommerce-nestjs
npm install
npm run start:dev
```

Frontend (Next.js):
```bash
cd frontend/ecommerce-nextjs
npm install
npm run dev
```

Note: the frontend expects the backend at `http://localhost:3000` by default.

Important environment variables
-------------------------------

The backend uses environment variables (see `backend/ecommerce-nestjs/.env` if present):

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_CONNECTION_NAME` — MySQL connection
- `JWT_PASSWORD` — secret used for signing/verifying JWTs

The `docker-compose.yml` provides defaults for development.

Useful endpoints
----------------

- `GET /users/me` — returns current user data (requires `Authorization: Bearer <token>` header).
- `PATCH /users/me` — update profile (`{ name, email, cpf, currentPassword }`).
- `PATCH /users/me/avatar` — upload avatar (multipart/form-data, field `avatar`).
- `PATCH /users/me/password` — change password (requires `currentPassword`).

Avatar upload
-------------

- Upload is handled by the backend at `PATCH /users/me/avatar` and saves the file to:
	`frontend/ecommerce-nextjs/public/userAvatar/<file>`
- The `avatar` field on the user is updated to `/userAvatar/<file>`.
- The frontend profile component (`src/app/profile/page.tsx`) uploads via `FormData` and updates the preview.
- The nav menu (`src/components/navUser.tsx`) fetches `GET /users/me` to display the saved avatar.

Database notes
--------------

- The backend is configured with `synchronize: true` in `src/app.module.ts`, which will auto-create/update tables during development.
- Do NOT use `synchronize: true` in production; use migrations instead.

Troubleshooting
---------------

- FK errors after changing entities: drop the schema or use migrations.
- 401 tokens: check `localStorage.token` and ensure the frontend sends `Authorization: Bearer <token>`.
- Avatar not showing: confirm `GET /users/me` returns `avatar` pointing to `/userAvatar/<file>` and file exists in `frontend/ecommerce-nextjs/public/userAvatar`.

Development tips
----------------

- If static files (avatars) don't appear immediately in Docker, restart the frontend container or mount `public/userAvatar` as a volume.
- Use browser DevTools Network tab to inspect requests.

Where to look in code
---------------------

- Backend controllers/services: `backend/ecommerce-nestjs/src/users`.
- TypeORM entities: `backend/ecommerce-nestjs/src/typeorm/entities`.
- Frontend profile/upload: `frontend/ecommerce-nextjs/src/app/profile/page.tsx`.
- Nav/menu: `frontend/ecommerce-nextjs/src/components/navUser.tsx`.

Contributing
------------

- Fork and open PRs. Tests and lint fixes are welcome.

License
-------

Add license information here if desired.

---

If you'd like, I can:
- add a `docker-compose` volume for `userAvatar` to ease local dev,
- create a TypeORM migration for the `avatar` column, or
- add automatic avatar reload in the frontend when a user updates their avatar.
# Ecommerce (Monorepo)

Este repositório contém um backend em NestJS (MySQL/TypeORM) e um frontend em Next.js.

## Sumário
- Visão geral
- Estrutura do projeto
- Pré-requisitos
- Rodando com Docker Compose
- Rodando localmente (dev)
- Variáveis de ambiente importantes
- Endpoints úteis
- Upload de avatar
- Notas e troubleshooting

---

## Visão geral

Projeto de e-commerce com:
- Backend: `backend/ecommerce-nestjs` (NestJS + TypeORM + MySQL)
- Frontend: `frontend/ecommerce-nextjs` (Next.js React)

## Estrutura principal

- `backend/ecommerce-nestjs`: código NestJS, entidades TypeORM em `src/typeorm/entities`.
- `frontend/ecommerce-nextjs`: app Next.js (app dir) e componentes em `src/components`.
- `docker-compose.yml`: orquestra containers (MySQL, frontend, backend).
- `frontend/ecommerce-nextjs/public/userAvatar`: pasta onde uploads de avatar são salvos e servidos por Next.

## Pré-requisitos

- Docker & Docker Compose (recomendado para testes locais confiáveis)
- Node.js (para rodar frontend/backend localmente sem Docker)
- NPM ou PNPM/Yarn

## Rodando com Docker Compose (recomendado)

O `docker-compose.yml` no root já configura os serviços:
- `db` (MySQL 8) na porta `3001` do host (mapeado para 3306 no container)
- `nest` (backend) na porta `3000` do host
- `next` (frontend) na porta `5173` do host

Para subir tudo:
```bash
docker-compose up --build -d
```

Ver logs:
```bash
docker-compose logs -f
```

Parar e remover:
```bash
docker-compose down
```

Ports expostas (host → container):
- `3001` → MySQL (3306)
- `3000` → Backend (NestJS)
- `5173` → Frontend (Next.js)

## Rodando localmente (sem Docker)

Backend (NestJS):
```bash
cd backend/ecommerce-nestjs
npm install
npm run start:dev
```

Frontend (Next.js):
```bash
cd frontend/ecommerce-nextjs
npm install
npm run dev
```

Observação: o frontend espera que o backend esteja disponível em `http://localhost:3000`.

## Variáveis de ambiente importantes

As variáveis usadas pelo `docker-compose.yml` e pelo backend (veja `backend/ecommerce-nestjs/.env` se existir):

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_CONNECTION_NAME` — configuração do MySQL
- `JWT_PASSWORD` — segredo para gerar/verificar tokens JWT

No `docker-compose.yml` já estão definidas versões default para desenvolvimento.

## Endpoints úteis

- `GET /users/me` — retorna os dados do usuário logado (necessita header `Authorization: Bearer <token>`).
- `PATCH /users/me` — atualiza perfil (envia `{ name, email, cpf, currentPassword }`).
- `PATCH /users/me/avatar` — endpoint para upload de avatar (multipart/form-data com campo `avatar`).
- `PATCH /users/me/password` — altera senha (necessita `currentPassword`).

## Upload de avatar

- O upload é tratado pelo backend em `PATCH /users/me/avatar` e salva o arquivo na pasta do frontend:
	`frontend/ecommerce-nextjs/public/userAvatar/<arquivo>`
- O campo `avatar` do usuário é atualizado com o caminho público `/userAvatar/<arquivo>`.
- O frontend de perfil (`src/app/profile/page.tsx`) já faz o upload via `FormData` e atualiza o preview.
- O componente de menu `src/components/navUser.tsx` busca `GET /users/me` ao carregar para exibir o `avatar` salvo.

## Notas sobre banco de dados

- O backend está configurado com `synchronize: true` (em `src/app.module.ts`). Isso cria/atualiza tabelas automaticamente em desenvolvimento.
- Em produção não é recomendado — use migrations.

## Troubleshooting comum

- Erro de FK ao migrar: se trocar relacionamentos (entities) pode ser necessário dropar o schema ou usar migrations.
- Erro de token 401: verifique `localStorage.token` no navegador; frontend envia Authorization: `Bearer <token>`.
- Avatar não aparece: confirme que `GET /users/me` retorna `avatar` com `/userAvatar/<file>` e que o arquivo existe em `frontend/ecommerce-nextjs/public/userAvatar`.

## Dicas de desenvolvimento

- Para refletir mudanças em arquivos estáticos (avatars) durante o desenvolvimento com Docker, pode ser preciso reiniciar o container do frontend ou garantir que a pasta `public/userAvatar` esteja montada/visível.
- Para inspecionar requests: use DevTools → Network no navegador.

## Onde olhar no código

- Backend controllers e serviços: `backend/ecommerce-nestjs/src/users`.
- Entidades TypeORM: `backend/ecommerce-nestjs/src/typeorm/entities`.
- Frontend perfil e upload: `frontend/ecommerce-nextjs/src/app/profile/page.tsx`.
- Nav/menu: `frontend/ecommerce-nextjs/src/components/navUser.tsx`.

## Contribuindo

- Faça fork e envie PRs. Testes e lint são bem-vindos.

## Licença

Indique aqui a licença do projeto se desejar.

---

Se quiser, eu:
- adiciono scripts no `docker-compose.yml` para montar `userAvatar` como volume (facilita desenvolvimento),
- crio uma migration para a nova coluna `avatar`, ou
- implemento um endpoint adicional para `GET /users/me` mock se necessário.
