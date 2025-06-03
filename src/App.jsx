import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router'
import Nav from './components/NavBar'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
// import Feed from './pages/Feed'
// import Home from './pages/Home'
import { CheckSession } from './services/Auth'
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
    //Reset all auth related state and clear localStorage
    setUser(null)
    localStorage.clear()
  }

const checkToken = async () => {
  const user = await CheckSession()
  setUser(user)
}


  return (
    <>
      <Nav user={user} handleLogOut={handleLogOut} />
      <main>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/signin" element={<SignIn setUser={ setUser }/>} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/feed" element={<Feed user={ user }/>} /> */}
        </Routes>
      </main>
    </>
  )
}

export default App
