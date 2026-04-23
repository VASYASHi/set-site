import './App.css'
import Main from './main/main'
import Auth from './auth/auth'
import ConfirmAuth from './auth/confirmAuth'
import { Route, Routes, useLocation } from 'react-router-dom'
import Regist from './auth/regist'
import { AnimatePresence } from 'framer-motion'

function App() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode='wait'>
    <Routes location={location} key={location.pathname}>
      <Route path='/' element={<Main/>}/>
      <Route path='/auth' element={<Auth/>}/>
      <Route path='/regist' element={<Regist/>}/>
      <Route path='/confirm_password' element={<ConfirmAuth/>}/>
    </Routes>
    </AnimatePresence>
  )
}

export default App
