import { createRoot } from 'react-dom/client'

import { AuthProvider } from './AuthContext.jsx'

import { BrowserRouter } from 'react-router-dom'

import ProjectRoutes from './Routers.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
    <ProjectRoutes/>
    </BrowserRouter>
  </AuthProvider>,
)
