import React from 'react'

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
              
              {user && user._id === course.owner?._id && (
                <div className="user massage">
                  <p>Enter to edit/delete your course</p>
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