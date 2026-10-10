import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Schriftart Nunito, liegt mit in der App – es wird nichts von Google geladen
import '@fontsource-variable/nunito'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
