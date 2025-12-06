# SchoolMate – AI Tutor & Quiz Platform

SchoolMate is an AI-powered learning platform that enables students to **chat with their PDFs**, **generate quizzes**, and engage in a **1:1 AI Tutor experience**.

The goal is not only to answer questions but also to **develop critical thinking skills** by allowing students to debate with the AI, ask follow-up questions, and reflect on their readings.

---

## 🚀 Features

### 👩‍🏫 Learning Experience

- **Chat with PDF Documents**

  - Upload lecture slides, textbooks, or notes (in PDF format).
  - Ask questions in natural language.
  - AI provides answers based on the content of the uploaded document using RAG (Retrieval-Augmented Generation).

- **Two AI Modes**
  - **Tutor Mode**
    - Socratic-style AI Tutor.
    - Engages students with probing questions and challenges their assumptions.
    - Aims to improve **critical thinking** rather than just recall information.
  - **Summary Mode**
    - Provides concise explanations and key-point summaries.
    - Ideal for quick revisions and review.

### 📚 Quiz Generation

- Create quizzes based on:
  - **PDF documents** to reinforce key concepts and knowledge.
  - **Web links** to test understanding of online materials.
  - **Plain text or notes** for personalized quizzes.
- **Features of the Quiz System**

  - Generate quizzes directly from the contents of uploaded PDFs, allowing users to focus on specific sections or topics.
  - Save quizzes to a personal **Quiz Library** for later review and practice.
  - Support for viewing past quiz attempts to track progress over time.
  - Multiple-choice, true/false, and open-ended questions formats for varied assessment styles.

- **Quiz Library**
  - Users can view, edit, and delete quizzes.
  - Retry quizzes to assess improvement and mastery of content.

---

## 🧠 AI & RAG

- Utilizes **Retrieval-Augmented Generation (RAG)**:
  1. Extracts text from uploaded PDFs.
  2. Creates embeddings and stores them in a vector database.
  3. For each user question, retrieves the most relevant content segments.
  4. Sends the retrieved context and user messages to the AI model for generating responses.
- Built on top of **AI SDK** with **Google Gemini** models.
- Uses **streaming responses** for smooth user interactions.

---

## 🛠 Tech Stack

### Frontend

- **Next.js** (App Router)
- **TypeScript**
- **React**
- **Tailwind CSS**
- **shadcn/ui**
- **React Markdown** (for rendering AI responses)
- **TanStack Query (React Query)** – for client-side caching and server state

### Backend & Infrastructure

- **Next.js API Routes**
- **Prisma** (ORM)
- **PstgreSQL**
- **Pinecone** Vector store for embeddings
- **Vercel Blob** File storage for PDFs

### Authentication

- **Clerk** – for authentication and user management

### AI

- **AI SDK** (`ai`, `@ai-sdk/react`)
- **Google Gemini API** via `@ai-sdk/google`
- Custom **system prompts** for Tutor and Summary modes
- **LangChain** for text split to chunk before embeddings

---

## 📁 Main Features in Code (Quick Tour)

### Chat API (`/api/chat`)

- Handles chat requests from the client.
- Expects a request body:

  ```ts
  type ChatRequestBody = {
  	messages: UIMessage[];
  	documentId?: string;
  	chatId?: string;
  	mode?: "tutor" | "summary";
  };
  ```

- Flow:
  1. Authenticate the user (Clerk).
  2. Extract the user's latest question from messages.
  3. Query the vector store with `embeddings.embedQuery(question)` and `getVectorStore()`.
  4. Build `context` from the top matches.
  5. Select the **system prompt** based on the mode:
     - **Summary Mode** → Direct, concise answers.
     - **Tutor Mode** → Interactive, challenges the user, promotes critical thinking.
  6. Call `streamText` with Google Gemini model.
  7. On finish, save chat and messages to the database via Prisma.

### Chat Page (`/chat/[documentId]`)

- Layout:

  - **Left Sidebar** – Document info, page navigation.
  - **Center** – PDF viewer (with scrolling, zoom, and page synchronization).
  - **Right Panel** – AI chat UI (messages, input, mode switcher, history).

- Uses `useChat` from `@ai-sdk/react` with a custom `DefaultChatTransport`.

### Document Management

- `/api/documents`:
  - List user’s uploaded documents.
  - Delete a document.
- Upload flow:
  - PDF file upload.
  - Store file.
  - Extract text, generate chunks, embed, and store in the vector database.
  - Save document metadata to the database.

### Quiz System

- Quiz creation pages:

  - From **PDF upload** (`/quiz/create/pdf-upload`)
  - From **URL** (`/quiz/create/insert-link`)
  - From **text input** (`/quiz/create/text`)

- `/quiz` – Quiz library for user access:
  - View a list of created quizzes with search and filter options.
  - Access quiz details and attempt history.

---

## ⚙️ Getting Started

### 1. Prerequisites

- Node.js (v18+ recommended)
- pnpm / npm / yarn
- PostgreSQL (or any DB supported by Prisma)
- Clerk account (for authentication)
- Google Generative AI API key
- Vector DB (or your own implementation wrapped in `getVectorStore`)

### 2. Environment Variables

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME"

# Clerk
CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# Google Gemini (via AI SDK)
GOOGLE_GENERATIVE_AI_API_KEY="..."

# Any additional vector DB / storage configs you use
# VECTOR_DB_URL=...
# FILE_STORAGE_BUCKET=...
```

### 3. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 4. Database Setup

```bash
npx prisma migrate dev
# or
npx prisma db push
```

(Optional) Open Prisma Studio to inspect data:

```bash
npx prisma studio
```

### 5. Run the Development Server

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open your browser and go to http://localhost:3000.

---

## 🧩 Project Structure (Simplified)

```text
src/
  app/
    chat/
      [documentId]/
        page.tsx            # Chat page (PDF + AI chat + mode switch)
    api/
      chat/
        route.ts            # Chat API (RAG + AI Tutor / Summary mode)
      documents/
        route.ts            # List / upload documents
        [id]/
          route.ts          # Delete document
      quiz/
        route.ts            # Quiz CRUD operations
  components/
    chat/
      ChatLeftSidebar.tsx
      ChatPdfViewer.tsx
      ChatRightPanel.tsx
    quiz/
      QuizCard.tsx
    AuthRequireCard.tsx
    PdfMainViewer.tsx
  lib/
    prisma.ts               # Prisma client
    vector-store.ts         # Embeddings and vector store helpers
    actions/
      chat.actions.ts       # Functions for fetching chat data
  types/
    types.global.ts         # Shared types (ChatMode, ChatSession, DocumentItem, ...)
```

---

## 🧪 Key Concepts

- **Socratic Tutoring**

  - Tutor mode encourages the AI **not to provide direct answers**.
  - It asks questions to lead the student to discover answers themselves.

- **RAG (Retrieval-Augmented Generation)**

  - Keeps AI responses grounded in the uploaded document.
  - Significantly reduces inaccuracies by always sourcing context from the vector database.

- **Mode-aware Prompting**
  - Same backend flow, but different interaction styles:
    - Summary mode delivers fast, factual responses.
    - Tutor mode engages users in interactive discussions.

---

## 📝 License

This is a personal learning project.  
Feel free to use it as a reference or inspiration for your own learning platform.
