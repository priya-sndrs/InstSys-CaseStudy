import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './login.jsx'
import ChatPrompt from './chatPrompt.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChatPrompt /> 
  </StrictMode>,
)
