import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App'
import { VantageProvider } from './storage/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VantageProvider>
      <App />
    </VantageProvider>
  </StrictMode>,
)

