import { useState } from 'react'
import { updateUserProfile } from '../services/User'

const EditProfile = ({ user, onUpdateSuccess }) => {
  const [formValues, setFormValues] = useState({
    name: user.name,
    email: user.email,
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formValues.password !== formValues.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      await updateUserProfile({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password
      })
      alert('Profile updated successfully!')
      onUpdateSuccess()
    } catch (error) {
      alert('Update failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          type="text"
          id="name"
          value={formValues.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          id="email"
          value={formValues.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          id="password"
          value={formValues.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={formValues.confirmPassword}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Update Profile</button>
    </form>
  )
}

export default EditProfile
