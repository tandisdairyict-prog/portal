import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import faIR from 'antd/locale/fa_IR'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        locale={faIR}
        direction="rtl"
        theme={{
          token: {
            fontFamily: "'Vazirmatn', sans-serif",
            colorPrimary: '#3b5bdb',
            borderRadius: 10,
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
)
