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
    setUser(updatedUser)
    setIsEditing(false)
  }

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-content">
      {!isEditing ? (
        <div className="col register">
          <h2>User Details</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Category: {user.category}</p>
          <button className="button-primary" onClick={handleEditClick}>
            Edit Profile
          </button>
        </div>
      ) : (
        <EditProfile user={user} onUpdateSuccess={handleUpdateSuccess} />
      )}
      <div className="col register">
          <h2>Enrollments</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Category: {user.category}</p>
          <button className="button-primary" onClick={handleEditClick}>
            Edit Profile
          </button>
        </div>
        </div>
    </div>
  )
}

export default Profile
