const Profile = ({ user }) => {
  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="courses-page">
      <h1>Profile</h1>
      <div>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Password: {user.password}</p>
        <p>Category: {user.category}</p>
        <button className="button-primary">Edit Profile</button>
      </div>
    </div>
  )
}

export default Profile