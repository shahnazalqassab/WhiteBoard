import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GetCourseById, DeleteCourse } from '../services/Courses'

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

  const handleEdit = () => {
    navigate(`/courses/edit/${course._id}`)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await DeleteCourse(course._id)
        navigate('/courses')
      } catch (err) {
        alert('Failed to delete course.')
      }
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!course) return <div>Course not found</div>

  return (
    <div className="course-detail">
      <button onClick={() => navigate('/courses')}>
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
                    className="button-document"
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
            onClick={handleEdit}>Edit Course
          </button>
          <button onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default CourseDetail