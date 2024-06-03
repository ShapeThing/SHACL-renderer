import React from 'react'
import ReactDOM from 'react-dom/client'
import ShaclRenderer, { schema } from '../lib'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ShaclRenderer shapes={new URL('/shapes/contact.ttl', location.origin)} targetClass={schema('Person')} />
  </React.StrictMode>
)
