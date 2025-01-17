import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';  



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            theme='colored'
            pauseOnFocusLoss
            draggable
            pauseOnHover />

  </StrictMode>,
)
