import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/lib/leaflet-setup'
import { AppProviders } from '@/providers/AppProviders'
import { App } from '@/App'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
