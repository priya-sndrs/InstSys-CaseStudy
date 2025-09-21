# Copilot Instructions for Ai-UI

## Project Overview
Ai-UI is a full-stack application for AI-powered chat and course management. It consists of a Python Flask backend and a React/Vite frontend. The backend manages user accounts, file uploads, RBAC, and AI model orchestration. The frontend provides the user interface for chat, course display, and file management.

## Architecture & Key Components
- **Backend (`backend/`)**: Flask app (`entrypoint.py`) exposes REST APIs for login, registration, file upload, chat, and course management. Uses custom RBAC logic (`newRBAC.py`), data collection (`utils/Security.py`), and AI model orchestration (`utils/LLM_model.py`).
- **Frontend (`frontend/`)**: React app (Vite) with components in `src/`. Communicates with backend via REST endpoints. Entry point is `main.jsx`.
- **Models (`backend/models/`)**: Contains HuggingFace sentence-transformers model files and config for semantic search and AI features.
- **Database (`backend/database/chroma_store/`)**: Stores data collections by role (Admin, Non_Faculty, Teaching_Faculty).
- **Uploads (`backend/uploads/`)**: User-uploaded files, organized by role.

## Developer Workflows
- **Backend**: Run with `python backend/entrypoint.py` (or use the provided `setup.bat`). Flask runs on port 5000. Debug mode is enabled by default.
- **Frontend**: Start with `npm install` then `npm run dev` in `frontend/`. Uses Vite for hot-reload and fast builds.
- **Model Usage**: Models are loaded via `sentence-transformers` (see `models/all-MiniLM-L6-v2/README.md`).
- **RBAC**: Role and assignment are persisted in `last_role_assign.json` and used to filter data and permissions.

## Project-Specific Patterns
- **File Uploads**: Files are uploaded to `/upload` endpoint and stored in `backend/uploads/{faculty|students|admin}/`. Duplicate handling and overwrite logic are implemented.
- **Role Mapping**: Roles are mapped and persisted for session context; see `map_student_role()` in `entrypoint.py`.
- **AI Analyst**: The `AIAnalyst` class is instantiated globally and refreshed via `/refresh_collections` endpoint when role/assign changes.
- **Config Files**: Critical configs in `backend/config/` (e.g., `config.json`, `chat_history.json`).
- **Course Management**: Courses are managed via `/courses` endpoint and stored in `backend/courses.json`.

## Integration Points
- **Frontend/Backend**: Communicate via REST endpoints (see `entrypoint.py` for routes).
- **External Dependencies**: Python: Flask, flask_cors, sentence-transformers. JS: React, Vite, ESLint.
- **Model Files**: HuggingFace model files in `backend/models/all-MiniLM-L6-v2/`.

## Conventions
- **Python**: Use type hints where possible. Organize logic into utility modules (`utils/`).
- **Frontend**: Use functional React components. CSS modules for styling. Vite config in `frontend/vite.config.js`.
- **Data**: Persist user/role state in JSON files for session context.

## Example Patterns
- To refresh AI model context after login/role change, POST to `/refresh_collections`.
- To upload a file, POST to `/upload` with `file` and `folder` fields.
- To add a course, POST to `/courses` with `department`, `program`, and `description`.

## Key Files
- `backend/entrypoint.py`: Main Flask app and API routes
- `backend/utils/LLM_model.py`: AI model orchestration
- `backend/newRBAC.py`: Role-based access logic
- `frontend/src/`: React components
- `backend/models/all-MiniLM-L6-v2/README.md`: Model usage details

---
For unclear or missing conventions, please ask for clarification or provide examples from the codebase.
