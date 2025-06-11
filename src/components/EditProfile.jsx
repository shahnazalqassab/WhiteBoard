import { useState, useEffect } from 'react'
import { updateUserProfile } from '../services/User'
const EditProfile = ({ user, onUpdateSuccess }) => {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  useEffect(() => {
    if (user) {
      setFormValues({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
      })
    }
  }, [user])
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formValues.password !== formValues.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (!user) {
      alert('User data is not available')
      return
    }

    try {
      await updateUserProfile({
        _id: user._id,
        name: formValues.name,
        email: formValues.email,
        password: formValues.password
      })
      alert('Profile updated successfully!')
    } catch (error) {
      console.log(error)
      alert('Update failed. Please try again.')
    }
  }
  return (
    <div className="col register">
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <label>Name</label>
          <input
            type="text"
            id="name"
            value={formValues.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-wrapper">
          <label>Email</label>
          <input
            type="email"
            id="email"
            value={formValues.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-wrapper">
          <label>Password</label>
          <input
            type="password"
            id="password"
            value={formValues.password}
            onChange={handleChange}
          />
        </div>
        <div className="input-wrapper">
          <label>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  )
}
export default EditProfile