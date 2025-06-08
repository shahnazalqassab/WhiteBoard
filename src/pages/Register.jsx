import { useNavigate } from 'react-router-dom'
import { RegisterUser } from '../services/User'
import { useState } from 'react'
import { set } from 'mongoose'

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
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (event) => {
    setFormValues({ ...formValues, [event.target.id]: event.target.value })
    setErrorMsg(''); // Clear error message on input change
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await RegisterUser({
      username: formValues.username,
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      category: formValues.category
    })
    setFormValues(initialState)
    navigate('/user/login')
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
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
            placeholder="write username"
            value={formValues.username}
            required
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="name">Name</label>
          <input
            onChange={handleChange}
            id="name"
            type="text"
            placeholder="Write your name"
            value={formValues.name}
            required
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
            !formValues.name ||
            !formValues.email ||
            !formValues.password ||
            !formValues.confirmPassword ||
            formValues.password !== formValues.confirmPassword ||
            formValues.category === ''
          }
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default Register
