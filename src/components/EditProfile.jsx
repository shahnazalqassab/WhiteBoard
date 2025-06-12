import { useState, useEffect } from 'react'
import { updateUserProfile } from '../services/User'
import { useNavigate } from 'react-router-dom'


const EditProfile = ({ user, onUpdateSuccess, onCancel }) => {
  const navigate = useNavigate()
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


    const handleChange = (event) => {
      setFormValues({ ...formValues, [event.target.id]: event.target.value })
    }

    const handleSubmit = async (event) => {
      event.preventDefault()
      try {
        if (formValues.password !== formValues.confirmPassword) {
          alert('Passwords do not match')
          return
        }
        if (!user) {
          alert('User data is not available')
          return
        }

          const updatedUser = await updateUserProfile({
          _id: user._id,
          name: formValues.name,
          email: formValues.email,
          ...(formValues.password && { password: formValues.password })
          })


        onUpdateSuccess(updatedUser)
        alert('Profile updated successfully!')
      } catch (error) {
        console.log(error)
        alert('Update failed. Please try again.')
      }
    }


  return (
    <div className="col profile">
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
        <button type="button" onClick={onCancel}>Cancel</button>

      </form>
    </div>
  )
}
export default EditProfile