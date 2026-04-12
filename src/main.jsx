import React, { useState, createContext } from 'react'
import ReactDOM from 'react-dom/client'
import DemoWrapper from './DemoWrapper'

export const AdminContext = createContext({ isAdmin: false, setIsAdmin: () => {} });

function Root() {
  const [isAdmin, setIsAdmin] = useState(false);
  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
      <DemoWrapper />
    </AdminContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
