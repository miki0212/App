import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import RegisterComponent from './components/register/RegisterComponent.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RegisterComponent />
  </React.StrictMode>,
)
