import { useNavigate } from 'react-router-dom'
import { RegisterUser } from '../services/User'
import { useState } from 'react'

const Register = () => {
  let navigate = useNavigate()
  
  const initialState = {
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    category: ''
  }

  const [formValues, setFormValues] = useState(initialState)

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await RegisterUser({
      username: formValues.username,
      email: formValues.email,
      password: formValues.password,
      category: formValues.category
    })
    setFormValues(initialState)
    navigate('/user/login')
  }

  return (
    <div className="col register">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <label htmlFor="username">Username</label>
          <input
            onChange={handleChange}
            id="username"
            type="text"
            placeholder="Jaays"
            value={formValues.username}
            required
            autoComplete="username"
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="name">Name</label>
          <input
            onChange={handleChange}
            id="name"
            type="text"
            placeholder="Jaffar Ali"
            value={formValues.name}
            required
            autoComplete="name"
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChange}
            id="email"
            type="email"
            placeholder="example@example.com"
            value={formValues.email}
            required
            autoComplete="email"
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            id="password"
            value={formValues.password}
            required
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            onChange={handleChange}
            type="password"
            id="confirmPassword"
            value={formValues.confirmPassword}
            required
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="category">Category</label>
          <select
            onChange={handleChange}
            id="category"
            value={formValues.category}
            required
          >
            <option value="">Select Category</option>            
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <button
          disabled={
            !formValues.username ||
            (!formValues.password &&
              formValues.password === formValues.confirmPassword)
          }
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default Register
