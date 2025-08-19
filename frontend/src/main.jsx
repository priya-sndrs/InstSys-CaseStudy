import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ChatPrompt from './chatPrompt.jsx'
import Navigate from './navigate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navigate /> 
  </StrictMode>,
)
