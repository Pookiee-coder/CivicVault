import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import GovPortal from './GovernmentPortal.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GovPortal />
  </StrictMode>,
)
