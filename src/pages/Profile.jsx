import { useEffect, useState } from 'react'
import EditProfile from '../components/EditProfile'
import { GetCoursesByOwner, GetCoursesByStudent, GetCourses, enrollmentAccepted, enrollmentRejected } from '../services/Courses'

const Profile = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [myCourses, setMyCourses] = useState([])
  const [pendingCourses, setPendingCourses] = useState([])


  useEffect(() => {
    const fetchMyCourses = async () => {
    if (user) {
        if (user.category === 'teacher') {
        const courses = await GetCoursesByOwner(user._id)
        setMyCourses(courses)
      } else if (user.category === 'student') {
        const courses = await GetCoursesByStudent(user._id)
        const pending = await GetCourses(user._id)
        setMyCourses(courses)
        setPendingCourses(pending)

      }
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

  const handleAcceptance = async (courseId, studentId) => {
    enrollmentAccepted(courseId, studentId)
  }

  const handleRejection = async (courseId, studentId) => {
    enrollmentRejected(courseId, studentId)

  }

  return (
    <div className="profile-page">
      <h1>User Dashboard</h1>
      <div className="profile-content">
      {!isEditing ? (
        <div className="col profile">
          <h1>User Profile</h1>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Category: {user.category}</p>
          <button className="button-primary" onClick={handleEditClick}>
            Edit Profile
          </button>
        </div>
      ) : (
      <EditProfile user={user} onUpdateSuccess={handleUpdateSuccess} onCancel={() => setIsEditing(false)} />
      )}
      
      <div className="col profile">
        <h1>Enrollments</h1>
        {user.category === 'teacher' ? (
          <>
          <h3>Pending Enrollments</h3>
            {(myCourses) && myCourses.length > 0 ? (
            myCourses.map(course => (
              <div key={course._id}>
                <strong>{course.name}</strong>
                {course.pendingEnrollments && course.pendingEnrollments.length > 0 ? (
                  <ul>
                    {course.pendingEnrollments.map(student => (
                      <li key={student._id}>{student.name} ({student.email})
                      <span title="Approve"
                      onClick={() => handleAcceptance(course._id, student._id)}
                      > ✔️ 
                      </span>
                      <span title="Reject"
                      onClick={() => handleRejection(course._id, student._id)}
                      > ❌
                      </span>
                      </li>
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
          </>
        ) : (
          <>
  <h3>Enrolled Courses</h3>
  {(myCourses) && myCourses.filter(course =>
    course.students?.some(student => student._id === user._id)
  ).length > 0 ? (
    myCourses
      .filter(course => course.students?.some(student => student._id === user._id))
      .map(course => (
        <div key={course._id}>
          <strong>{course.name}</strong>
          <p>Instructor: {course.owner?.name || 'Unknown'}</p>
        </div>
      ))
  ) : (
    <div>No courses enrolled.</div>
  )}

  <h3>Pending Enrollments</h3>
  {(pendingCourses) && pendingCourses.filter(course =>
    course.pendingEnrollments?.some(s => s._id === user._id)
  ).length > 0 ? (
    pendingCourses
      .filter(course => course.pendingEnrollments?.some(s => s._id === user._id))
      .map(course => (
        <div key={course._id}>
          <strong>{course.name}</strong>
          <div>Instructor: {course.owner?.name || 'Unknown'}</div>
        </div>
      ))
  ) : (
    <div>No pending enrollments.</div>
  )}
</>
        )}
        </div>
      </div>
    </div>
  )
}
export default Profile
