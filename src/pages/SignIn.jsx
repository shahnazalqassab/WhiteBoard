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

  const handleChange = (e) => {
    setFormValues ({ ...formValues, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = await SignInUser(formValues)
    setFormValues(initialState)
    setUser(payload)
    navigate('/')
  }

  return (
    <div className="signin">
      <form onSubmit={handleSubmit}>
        <div className='input-wrapper'>
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
