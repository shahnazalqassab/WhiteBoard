import { useNavigate } from 'react-router-dom'

const CourseList = ({ courses, onEdit, onDelete, onView, user }) => {
  const navigate = useNavigate()
  console.log('Courses:', courses)

  return (
    <div className="course-list">
      {courses.length === 0 ? (
        <p>No courses available</p>
      ) : (
        <ul>
          {courses.map(course => (
            <li key={course._id} className="course-item">
              <div onClick={() => onView(course._id)} className="course-info">
                <h3>{course.name}</h3>
                <p>Instructor: {course.owner?.name || 'Unknown'}</p>
                <p>Course description{course.description}</p>
              </div>
              
              {user && user._id === course.owner?._id && (
                <div className="course-actions">
                  <button onClick={() => navigate(`/courses/${course._id}`)}>
                    Edit
                  </button>
                  <button onClick={(event) => {event.stopPropagation(), onDelete(course._id)}}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CourseList