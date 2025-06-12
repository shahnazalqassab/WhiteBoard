import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { SignInUser } from '../services/User'

const SignIn = ({ setUser }) => {
  let navigate = useNavigate()

  const initialState = {
    username: '',
    password: ''
  }

  const [formValues, setFormValues] = useState(initialState)

  const handleChange = (event) => {
    setFormValues ({ ...formValues, [event.target.id]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
    const payload = await SignInUser(formValues)
      if (!payload) {
        alert('Invalid username or password')
        return
      }
    setFormValues(initialState)
    setUser(payload)
    navigate('/courses')
  } catch (error) {
    alert(error.response.data.msg)
  }
}

  return (
    <div className="col signin">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div className='input-wrapper'>
          <label htmlFor="username">Username</label>
          <input
            onChange={handleChange}
            id="username"
            type="text"
            placeholder="Enter username"
            value={formValues.username}
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
        <button disabled={!formValues.username || !formValues.password}>
          Sign In
        </button>
      </form>
    </div>
  )
}

export default SignIn