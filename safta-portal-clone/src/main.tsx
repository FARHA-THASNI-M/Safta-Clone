import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';  
import { Provider} from 'react-redux'
import { store } from './lib/redux/store.ts';



createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    <Provider store={store}>
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
    </Provider>
  </StrictMode>,
  
)
