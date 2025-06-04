import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router'
import NavBar from './components/NavBar'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import Courses from './pages/Courses'
import Home from './pages/Home'
import { CheckSession } from './services/User'
import './App.css'

const App = () => {
  const [user, setUser] = useState(null)


  useEffect( () => {
  const token = localStorage.getItem('token')

    if (token) {
      checkToken()
    }

}, [])

  const handleLogOut = () => {
    setUser(null)
    localStorage.clear()
  }

const checkToken = async () => {
  const user = await CheckSession()
  setUser(user)
}


  return (
    <>
      <NavBar user={user} handleLogOut={handleLogOut} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn setUser={ setUser }/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses user={ user }/>} />
        </Routes>
      </main>
    </>
  )
}

export default App
