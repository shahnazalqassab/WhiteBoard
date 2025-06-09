import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GetCourseById } from '../services/Courses'

const CourseDetail = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await GetCourseById(id)
        setCourse(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchCourse()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!course) return <div>Course not found</div>

  return (
    <div className="course-detail">
      <button onClick={() => navigate(-1)}>
        Back to Courses
      </button>
      
      <h1>{course.name}</h1>
      <p>Instructor: {course.owner?.name || 'Unknown'}</p>
      
   {course.lessons && course.lessons.length > 0 ? (
  course.lessons.map((lesson, id) => (
    <div className="lesson-section" key={id}>
      <h2>Lesson: {lesson.title}</h2>
      <div className="lesson-material">
        <h3>Material:</h3>
        <p>{lesson.material}</p>
      </div>
      {lesson.assignment && (
        <div className="assignment">
          <h3>Assignment: {lesson.assignment.title}</h3>
          <p>{lesson.assignment.material}</p>
          {lesson.assignment.document && (
            <a
              className="btn btn-document"
              href={lesson.assignment.document}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Assignment Document
            </a>
          )}
        </div>
      )}
    </div>
  ))
) : (
  <div className="lessons-message">
    No lessons have been added to this course yet.
  </div>
)}

      {user && user._id === course.owner?._id && (
        <div className="course-actions">
          <button 
            onClick={() => navigate(`/courses/edit/${course._id}`)}>
            Edit Course
          </button>
          <button onClick={() => navigate(`/courses/edit/${course._id}`)}>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default CourseDetail