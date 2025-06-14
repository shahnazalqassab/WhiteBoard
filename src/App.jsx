import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router'
import NavBar from './components/NavBar'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import CourseForm from './components/CourseForm'
import CourseEdit from './components/CourseEdit'
import Home from './pages/Home'
import { CheckSession } from './services/User'
import Profile from './pages/Profile'
import LessonAdd from './pages/LessonAdd'
import './Styles/App.css'

const App = () => {
  const [user, setUser] = useState(null)


  useEffect(() => {
    const token = localStorage.getItem('token')

    const checkToken = async () => {
      const user = await CheckSession()
      setUser(user)
    }

    if (token) {
      checkToken()
    }
  }, [])

  const handleLogOut = () => {
    setUser(null)
    localStorage.clear()
  }



  return (
    <>
      <NavBar user={user} handleLogOut={handleLogOut} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/login" element={<SignIn setUser={setUser} />} />
          <Route path="/user/register" element={<Register />} />
          <Route path='/profile' element={<Profile user={user} setUser={setUser} />} />
          <Route path="/courses" element={<Courses user={user} />} />
          <Route path="/courses/:id" element={<CourseDetail user={user} />} />
          <Route path="/courses/edit/:id" element={<CourseEdit user={user} />} />
          <Route path="/courses/:id/lesson/add" element={<LessonAdd />} />
        </Routes>
      </main>
    </>
  )
}

export default App
