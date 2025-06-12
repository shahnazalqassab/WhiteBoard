import { useEffect, useState } from 'react'
import EditProfile from '../components/EditProfile'
import { GetCoursesByOwner } from '../services/Courses'

const Profile = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [myCourses, setMyCourses] = useState([])


  useEffect(() => {
    const fetchMyCourses = async () => {
    if (user && user.category === 'teacher') {
        const courses = await GetCoursesByOwner(user._id)
        setMyCourses(courses)
      }
    }
    fetchMyCourses()
  }, [user])

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
        <div className="col profile">
          <h2>User Details</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Category: {user.category}</p>
          <button className="button-primary" onClick={handleEditClick}>
            Edit Profile
          </button>
        </div>
      ) : (
      <EditProfile user={user} onUpdateSuccess={handleUpdateSuccess} onCancel={() => setIsEditing(false)} />      )}
      
      <div className="col profile">
          <h2>Enrollments</h2>
          <h3>Pending Enrollments</h3>
            {user.category === 'teacher' && myCourses.length > 0 ? (
            myCourses.map(course => (
              <div key={course._id}>
                <strong>{course.name}</strong>
                {course.pendingEnrollments && course.pendingEnrollments.length > 0 ? (
                  <ul>
                    {course.pendingEnrollments.map(student => (
                      <li key={student._id}>{student.name} ({student.email})</li>
                    ))}
                  </ul>
                ) : (
                  <div>No pending enrollments for this course.</div>
                )}
              </div>
            ))
          ) : (
            <div>No courses with pending enrollments.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
