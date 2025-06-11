import { useState } from 'react'
import EditProfile from '../components/EditProfile'

const Profile = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false)

  if (!user) {
    return <div>Loading...</div>
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleUpdateSuccess = (updatedUser) => {
    setUser()
    setIsEditing(false)
  }

  return (
    <div className="courses-page">
      <h1>Profile</h1>
      {!isEditing ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Password: {user.password}</p>
          <p>Category: {user.category}</p>
          <button className="button-primary" onClick={handleEditClick}>
            Edit Profile
          </button>
        </div>
      ) : (
        <EditProfile user={user} onUpdateSuccess={handleUpdateSuccess} />
      )}
    </div>
  )
}

export default Profile
