import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GetCourseById } from '../services/Courses'


const CourseEdit = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [course, setCourse] = useState(null)
  const navigate = useNavigate()

  
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

  const [name, setName] = useState('')

    useEffect(() => {
      fetchCourse()

  }, [id])

    useEffect(() => {
    if (course) {
      setName(course.name)
      console.log('course:', course)

    }
  }, [course])



  const handleSubmit = (event) => {
    event.preventDefault()
    // onSubmit({ name, owner: user?._id || '' })
  }

  const handleCancel = () => {
    navigate(`/courses/${id}`)
  }

if (loading) return <div>Loading...</div>
if (error) return <div>Error: {error}</div>

  return (
    <div className="course-form">
      <h2>Edit Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course Name:</label>
          <input type="text" name="name" value={name}
            onChange={event => setName(event.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">Update Course</button>
          <button type="button" onClick={handleCancel}>Cancel</button>        </div>
      </form>
    </div>
  )
}

export default CourseEdit