# 📄 DocIntel AI

An AI-powered document intelligence platform that lets users upload PDF documents and have grounded, context-aware conversations with them using Retrieval-Augmented Generation (RAG). Built with FastAPI, React, Google Gemini, and Pinecone.

> **Note:** This is a local demo build with authentication disabled for quick setup and evaluation. Full JWT auth, Google OAuth, and password-reset flows are implemented in the codebase (see `Backend/app/auth/` and `Backend/app/routers/auth.py`) but are bypassed in this configuration so anyone cloning the repo can run it immediately without setting up OAuth credentials or SMTP.

---

## 📚 Table of Contents

- [Project Highlights](#-project-highlights)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [System Architecture](#️-system-architecture)
- [RAG Workflow](#-rag-workflow)
- [Repository Structure](#-repository-structure)
- [Environment Variables](#️-environment-variables)
- [Installation](#-installation)
- [API Endpoints](#-api-endpoints)
- [Roadmap](#️-roadmap)

---

## ✨ Project Highlights

- **Context-Grounded Q&A** — semantic vector search with Pinecone ensures responses are generated strictly from uploaded document content.
- **Multi-Document Intelligence** — upload and analyze multiple PDFs within a single conversation.
- **Automated Document Intelligence** — AI-generated summaries and contextual suggested questions.
- **Conversation-Scoped Retrieval** — vector search is filtered per conversation to keep document context isolated.
- **Dockerized, Production-Style Architecture** — FastAPI backend, React frontend, PostgreSQL, and Pinecone, orchestrated via Docker Compose.

---

## 🌟 Features

### 🤖 AI Document Intelligence
- Grounded document Q&A via Google Gemini through LangChain.
- Vector embeddings using Gemini's embedding model.
- Fast similarity search using Pinecone serverless indexes.

### 📄 Document Processing
- Multi-PDF upload and chunking with PyPDF text extraction.
- Automatic summary generation for uploaded files.
- Context-aware suggested follow-up questions per document.

### 💬 Conversation Management
- Persistent chat thread history backed by PostgreSQL.
- Sidebar thread management with pinning.
- Automated conversation title generation.

### 🖥️ UI
- Responsive interface built with React, Vite, and Tailwind CSS.
- Global state management using Zustand.
- Markdown response rendering with syntax highlighting.

### 🔐 Authentication (implemented, disabled by default in this demo)
- JWT bearer token authentication with bcrypt password hashing.
- Google OAuth 2.0 sign-in.
- Email-based forgot/reset password flow.
- Full user profile management (avatar, bio, password change, account stats).

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React, Vite, Tailwind CSS, Zustand | UI and global state management |
| Backend | Python, FastAPI, Uvicorn | Async REST backend |
| Database | PostgreSQL, SQLAlchemy ORM | Relational storage for users, chats, documents |
| Vector DB | Pinecone | Serverless vector indexing and similarity search |
| AI Models | Google Gemini | Language generation and text embeddings |
| Orchestration | LangChain, PyPDF | RAG chain construction and PDF processing |
| DevOps | Docker, Docker Compose | Multi-container orchestration |

---

## 🏗️ System Architecture

```
User → React Frontend → FastAPI Backend
                              ├── PostgreSQL (conversations, documents, users)
                              ├── Pinecone (vector search)
                              └── Google Gemini (embeddings + generation)
```

## 🔄 RAG Workflow

1. **Parsing & Chunking** — PDFs are processed via PyPDF and split into overlapping chunks to preserve context across boundaries.
2. **Vector Indexing** — Chunks are embedded via Gemini and upserted to Pinecone with conversation metadata tags.
3. **Targeted Retrieval** — User queries are embedded and matched against indexed vectors using cosine similarity, filtered by conversation ID.
4. **Context Augmentation** — Retrieved passages are combined with the query in a structured RAG prompt.
5. **Response Generation** — Gemini generates a grounded answer based strictly on retrieved context.

---

## 📁 Repository Structure

```
DocIntel-AI/
├── Backend/                      # FastAPI Backend Application
│   ├── app/
│   │   ├── auth/                 # JWT auth utilities (implemented, bypassed by default)
│   │   ├── chain/                # LangChain retrieval & RAG pipelines
│   │   ├── database/             # SQLAlchemy database connections & models
│   │   ├── models/                # ORM database schemas (User, Conversation, Document)
│   │   ├── routers/               # API endpoint route handlers
│   │   ├── schemas/               # Pydantic request/response schemas
│   │   └── services/              # Vectorstore, LLM, PDF parser & mail services
│   ├── Dockerfile
│   └── requirements.txt
├── Frontend/                     # React Frontend Application
│   ├── src/
│   │   ├── api/                   # Axios HTTP client configuration
│   │   ├── components/            # UI components (Sidebar, ChatBox, Modals)
│   │   ├── store/                 # Zustand global state stores
│   │   └── pages/                 # App page layouts (Dashboard, Chat, Profile)
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml             # Multi-service container orchestration
```

---

## ⚙️ Environment Variables

### Backend (`Backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `FRONTEND_URL` | Allowed CORS origins | Yes |
| `GOOGLE_API_KEY` | Gemini API key for LLM and embeddings | Yes |
| `DATABASE_URL` | PostgreSQL connection URL | Yes |
| `PINECONE_API_KEY` | Pinecone API key | Yes |
| `PINECONE_INDEX_NAME` | Pinecone index name (dimension must be **3072** to match Gemini embeddings) | Yes |
| `GOOGLE_CLIENT_ID` | OAuth client ID — only needed if re-enabling Google sign-in | No |
| `MAIL_USERNAME` / `MAIL_FROM` / `MAIL_PASSWORD` / `MAIL_SERVER` | SMTP config — only needed if re-enabling password reset emails | No |

### Frontend (`Frontend/.env`)

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Base URL of the FastAPI backend | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Matches backend OAuth client ID | No |

---

## 🚀 Installation

### Prerequisites
- Python 3.10+
- Node.js
- PostgreSQL (local or via Docker)
- A [Google Gemini API key](https://aistudio.google.com/apikey)
- A [Pinecone](https://app.pinecone.io) account with an index created at **dimension 3072**

### Local Setup

**Backend**
```bash
cd Backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
# create Backend/.env with the variables listed above
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend**
```bash
cd Frontend
npm install
# create Frontend/.env with the variables listed above
npm run dev
```

App runs at `http://localhost:5173`, API docs at `http://localhost:8000/docs`.

### Docker Compose

```bash
docker compose up --build
```

---

## 🔗 API Endpoints

| Category | Endpoint | Method | Description |
|---|---|---|---|
| Upload | `/api/upload` | POST | Process PDF, generate embeddings & store in Pinecone |
| Chat | `/api/chat` | POST | Send message and receive RAG-grounded response |
| Conversations | `/api/conversations` | GET | Fetch all chat histories |
| Conversations | `/api/conversations/{id}/pin` | PUT | Toggle pinned status |
| Documents | `/api/documents` | GET | List active documents |
| Profile | `/api/profile` | GET / PUT | Retrieve or update user profile |

*(Auth endpoints also exist under `/api/auth/*` but are unused while auth is bypassed.)*

---

## 🗺️ Roadmap

- [x] Multi-PDF ingestion and vector storage
- [x] Context-grounded Q&A with Gemini
- [x] AI-generated document summaries
- [x] AI-generated suggested questions
- [x] Multi-document conversations
- [ ] Multi-format ingestion (.docx, .txt, .pptx)
- [ ] Hybrid search (BM25 + dense retrieval)
- [ ] OCR support for scanned PDFs
- [ ] Re-enable auth for multi-user deployment
