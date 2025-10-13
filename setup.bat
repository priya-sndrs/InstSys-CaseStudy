@echo off
echo Installing backend dependencies...
cd backend
pip install flask flask-cors werkzeug cryptography chromadb sentence-transformers pandas PyMuPDF requests 
ollama pull llama3:8b
ollama pull phi3:latest
deactivate
cd ..

echo Installing frontend dependencies...
cd frontend
npm install
npm install concurrently --save-dev
npm install react-markdown remark-gfm react-syntax-highlighter
start http://localhost:5173/

echo Setup complete!

