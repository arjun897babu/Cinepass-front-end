
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store, { persist } from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import React from 'react'
const { VITE_GOOGLE_CLIENT_ID } = import.meta.env

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>

    <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>

      <Provider store={store}>
        <PersistGate loading={null} persistor={persist} />
        {/* <React.StrictMode> */}
          <App />
        {/* </React.StrictMode> */}
      </Provider>
    </GoogleOAuthProvider>
  </BrowserRouter>
)
 