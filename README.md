<div align="center">

# 🎬 CineStream

**A full-stack Netflix-inspired streaming platform**

[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[Funcionalidades](#-funcionalidades) • [Stack](#-stack) • [Como rodar](#-como-rodar) • [API](#-documentação-da-api) • [Estrutura](#-estrutura-do-projeto) • [Testes](#-testes)

</div>

---

## 📋 Sobre o projeto

O **CineStream** é um clone simplificado da Netflix, construído como desafio técnico full stack. O objetivo é demonstrar arquitetura limpa, boas práticas de desenvolvimento e integração completa entre frontend e backend.

O projeto inclui:
- API REST completa com autenticação JWT
- Interface responsiva inspirada no Netflix
- Sistema de watchlist por usuário
- Filtragem e busca de conteúdo
- Testes automatizados no backend e frontend
- Ambiente completamente containerizado com Docker

---

## ✨ Funcionalidades

### Usuário
- ✅ Cadastro e login com JWT
- ✅ Navegação pelo catálogo de filmes e séries
- ✅ Busca por título
- ✅ Filtro por tipo (filme / série) e categoria
- ✅ Página de detalhes com trailer, avaliação e duração
- ✅ Adicionar / remover da Minha Lista (watchlist)
- ✅ Rota protegida — watchlist exige login

### Admin
- ✅ CRUD completo de filmes via API
- ✅ Controle de acesso por role (user / admin)

---

## 🛠️ Stack

### Backend
| Tecnologia | Uso |
|---|---|
| **Node.js 20** | Runtime |
| **Express 4** | Framework HTTP |
| **PostgreSQL 15** | Banco de dados relacional |
| **Sequelize 6** | ORM |
| **JWT** | Autenticação |
| **bcryptjs** | Hash de senhas |
| **Joi** | Validação de requisições |
| **Helmet** | Headers de segurança |
| **express-rate-limit** | Rate limiting |
| **Jest + Supertest** | Testes |

### Frontend
| Tecnologia | Uso |
|---|---|
| **Next.js 14** | Framework React (CSR/SSR) |
| **Tailwind CSS** | Estilização utility-first |
| **Axios** | Client HTTP com interceptors |
| **React Icons** | Ícones |
| **Jest + Testing Library** | Testes de componentes |

### Infraestrutura
| Tecnologia | Uso |
|---|---|
| **Docker** | Containerização |
| **Docker Compose** | Orquestração local |

---

## 🚀 Como rodar

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando

Só isso. Não precisa instalar Node, PostgreSQL nem nada mais.

---

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/cinestream.git
cd cinestream
```

### 2. Configure as variáveis de ambiente

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

> Os valores padrão já funcionam localmente. Não precisa editar nada.

### 3. Suba os containers

```bash
docker compose up --build
```

Aguarde as mensagens:
```
✅ PostgreSQL connected
✅ Models synchronized
🚀 CineStream API running on http://localhost:4000
```

### 4. Popule o banco (primeira vez apenas)

Em outro terminal:

```bash
docker exec cinestream_backend npm run db:seed
```

Saída esperada:
```
✅ Seed complete!
   Admin: admin@cinestream.com / admin123
   User:  user@cinestream.com  / user123
```

### 5. Acesse

| Serviço | URL |
|---|---|
| **Frontend** | http://localhost:3000 |
| **API** | http://localhost:4000/api |
| **API Docs** | http://localhost:4000/api-docs |
| **Health Check** | http://localhost:4000/health |

---

### Contas demo

| Role | Email | Senha |
|------|-------|-------|
| Usuário | user@cinestream.com | user123 |
| Admin | admin@cinestream.com | admin123 |

---

### Parar os containers

```bash
# Parar (mantém dados)
docker compose down

# Parar e apagar banco
docker compose down -v
```

---

## 📁 Estrutura do projeto

```
cinestream/
├── docker-compose.yml
├── .gitignore
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── server.js              # Entry point
│       ├── app.js                 # Express + middlewares
│       ├── config/
│       │   ├── database.js        # Conexão Sequelize
│       │   ├── swagger.js         # Documentação OpenAPI
│       │   └── seed.js            # Script de seed
│       ├── models/
│       │   ├── user.model.js
│       │   ├── movie.model.js
│       │   ├── category.model.js
│       │   └── watchlist.model.js
│       ├── services/              # Regras de negócio
│       │   ├── auth.service.js
│       │   ├── movie.service.js
│       │   └── watchlist.service.js
│       ├── controllers/           # Request / Response
│       │   ├── auth.controller.js
│       │   ├── movie.controller.js
│       │   ├── category.controller.js
│       │   └── watchlist.controller.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── movie.routes.js
│       │   ├── category.routes.js
│       │   └── watchlist.routes.js
│       ├── middlewares/
│       │   ├── auth.middleware.js      # Verificação JWT
│       │   ├── validate.middleware.js  # Validação Joi
│       │   └── error.middleware.js     # Handler global de erros
│       └── tests/
│           ├── auth.test.js
│           └── movie.test.js
│
└── frontend/
    ├── Dockerfile
    ├── .env.example
    ├── next.config.js
    ├── tailwind.config.js
    └── src/
        ├── pages/
        │   ├── _app.jsx
        │   ├── _document.jsx
        │   ├── index.jsx              # Home — Hero + rows de filmes
        │   ├── login.jsx
        │   ├── register.jsx
        │   ├── watchlist.jsx          # Rota protegida
        │   └── movies/[id].jsx        # Detalhe do filme
        ├── components/
        │   ├── Navbar.jsx             # Navbar responsiva com busca
        │   ├── Hero.jsx               # Banner hero com backdrop
        │   ├── MovieCard.jsx          # Card com hover estilo Netflix
        │   ├── MovieRow.jsx           # Linha horizontal com scroll
        │   ├── AuthForm.jsx           # Formulário reutilizável login/register
        │   ├── LoadingSpinner.jsx
        │   └── EmptyState.jsx
        ├── hooks/
        │   ├── useAuth.js             # Context + hook de autenticação
        │   └── useWatchlist.js        # Toggle + cache da watchlist
        ├── services/
        │   ├── api.js                 # Axios instance + interceptors JWT
        │   └── movies.service.js      # Todos os endpoints da API
        ├── utils/
        │   └── helpers.js
        └── tests/
            ├── MovieCard.test.jsx
            └── AuthForm.test.jsx
```

---

## 📖 Documentação da API

**Base URL:** `http://localhost:4000/api`

A documentação completa em formato OpenAPI está disponível em:
```
http://localhost:4000/api-docs
```

### Autenticação

Rotas protegidas exigem o header:
```
Authorization: Bearer <token>
```

---

### Auth

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `POST` | `/auth/register` | Público | Cadastrar usuário |
| `POST` | `/auth/login` | Público | Login |
| `GET` | `/auth/me` | 🔒 Auth | Perfil do usuário logado |

**POST /auth/register**
```json
// Body
{
  "name": "Pedro Silva",
  "email": "pedro@example.com",
  "password": "secret123"
}

// Response 201
{
  "user": { "id": 1, "name": "Pedro Silva", "email": "pedro@example.com", "role": "user" },
  "token": "eyJhbGci..."
}
```

**POST /auth/login**
```json
// Body
{ "email": "pedro@example.com", "password": "secret123" }

// Response 200
{
  "user": { "id": 1, "name": "Pedro Silva", "email": "pedro@example.com" },
  "token": "eyJhbGci..."
}
```

---

### Movies

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/movies` | Público | Listar filmes (paginado) |
| `GET` | `/movies/featured` | Público | Filmes em destaque (rating ≥ 8.5) |
| `GET` | `/movies/:id` | Público | Detalhes de um filme |
| `POST` | `/movies` | 🔒 Admin | Criar filme |
| `PUT` | `/movies/:id` | 🔒 Admin | Atualizar filme |
| `DELETE` | `/movies/:id` | 🔒 Admin | Deletar filme |

**Query params — GET /movies**

| Param | Tipo | Descrição |
|-------|------|-----------|
| `page` | integer | Página (padrão: 1) |
| `limit` | integer | Itens por página (padrão: 20, máx: 100) |
| `type` | string | `movie` ou `series` |
| `category` | integer | ID da categoria |
| `search` | string | Busca por título |

**Response — GET /movies**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Inception",
      "year": 2010,
      "duration": 148,
      "rating": 8.8,
      "type": "movie",
      "poster_url": "https://...",
      "backdrop_url": "https://...",
      "trailer_url": "https://...",
      "category": { "id": 5, "name": "Sci-Fi", "slug": "sci-fi" }
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### Categories

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/categories` | Público | Listar categorias |
| `GET` | `/categories/:id` | Público | Detalhe de uma categoria |

---

### Watchlist

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/watchlist` | 🔒 Auth | Listar filmes salvos |
| `POST` | `/watchlist/:movieId` | 🔒 Auth | Adicionar à lista |
| `DELETE` | `/watchlist/:movieId` | 🔒 Auth | Remover da lista |
| `GET` | `/watchlist/:movieId/check` | 🔒 Auth | Verificar se está na lista |

---

## 🧪 Testes

### Backend

```bash
# Todos os testes
docker exec cinestream_backend npm test

# Com coverage
docker exec cinestream_backend npm run test:coverage
```

**Suites:**
- `auth.test.js` — registro, login, perfil (6 casos)
- `movie.test.js` — CRUD completo + autorizações (7 casos)

### Frontend

```bash
docker exec cinestream_frontend npm test
```

**Suites:**
- `MovieCard.test.jsx` — renderização, acessibilidade, fallback (5 casos)
- `AuthForm.test.jsx` — campos, submit, loading, erros (6 casos)

---

## 🔐 Segurança

- Senhas com **bcryptjs** (10 salt rounds)
- **JWT** com expiração configurável (padrão 7 dias)
- **Helmet** — headers de segurança HTTP
- **CORS** restrito à origem do frontend
- **Rate limiting** — 100 req/15min por IP
- **Validação** de entrada em todos os endpoints de escrita com Joi
- **Role-based access control** — rotas admin protegidas
- Senhas **nunca retornadas** nas respostas da API

---

## 🌍 Deploy

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
```

### Backend → Render

1. Crie um **Web Service** no [Render](https://render.com)
2. Conecte o repositório GitHub
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Adicione as variáveis de ambiente do `.env.example`

### Banco → Neon (PostgreSQL serverless gratuito)

1. Crie um banco em [neon.tech](https://neon.tech)
2. Copie a connection string
3. Atualize as variáveis `DB_*` no Render
4. Rode o seed: `node src/config/seed.js`

---

## 🤝 Contribuindo

```bash
# Fork o projeto
git checkout -b feature/minha-feature
git commit -m 'feat: adiciona minha feature'
git push origin feature/minha-feature
# Abra um Pull Request
```

---

## 📄 Licença

MIT © [Pedro Bueno](https://github.com/seu-usuario)
