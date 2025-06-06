const CourseList = ({ courses, onEdit, onDelete, onView, user }) => {
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
              </div>
              
              {user && user.id === course.owner?._id && (
                <div className="course-actions">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(course)
                    }}
                    className="btn btn-sm btn-edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(course._id)
                    }}
                    className="btn btn-sm btn-delete"
                  >
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