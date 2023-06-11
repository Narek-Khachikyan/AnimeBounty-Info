import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "./globalStyles/reset.css"
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import store from './app/store.js'
import recomendationApi from './features/apiSlice.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <ApiProvider api={recomendationApi}>
        <App />
      </ApiProvider>
    </Provider>
  </BrowserRouter>
)
