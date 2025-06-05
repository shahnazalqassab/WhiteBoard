import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GetCourseById } from '../services/CourseServices'

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
      <button onClick={() => navigate(-1)} className="btn btn-back">
        Back to Courses
      </button>
      
      <h1>{course.name}</h1>
      <p>Created by: {course.owner?.name || 'Unknown'}</p>
      
      <div className="lesson-section">
        <h2>Lesson: {course.lessons.title}</h2>
        <div className="lesson-material">
          <h3>Material:</h3>
          <p>{course.lessons.material}</p>
        </div>
        
        <div className="assignment">
          <h3>Assignment: {course.lessons.assignment.title}</h3>
          <p>{course.lessons.assignment.material}</p>
          {course.lessons.assignment.document && (
            <a 
              href={course.lessons.assignment.document} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-document"
            >
              View Assignment Document
            </a>
          )}
        </div>
      </div>
      
      {user && user.id === course.owner?._id && (
        <div className="course-actions">
          <button 
            onClick={() => navigate(`/courses/edit/${course._id}`)}
            className="btn btn-edit"
          >
            Edit Course
          </button>
        </div>
      )}
    </div>
  )
}

export default CourseDetail