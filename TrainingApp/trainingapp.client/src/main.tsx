import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import MainWindow from './components/mainComponent/MainWindow.tsx'
//import RegisterComponent from './components/register/RegisterComponent.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MainWindow></MainWindow>
        {/*<button>Show Login page</button>*/}
        {/*<button>Show Register page</button>*/}
        {/*<RegisterComponent />*/}
  </React.StrictMode>,
)
