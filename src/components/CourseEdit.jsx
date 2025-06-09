import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CourseEdit = ({ course, onSubmit, user }) => {
  const navigate = useNavigate()
  console.log('course:', course)
  
  const [name, setName] = useState('')

  useEffect(() => {
    if (course) {
      setName(course.name)
    }
  }, [course])

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('user:', user)
    onSubmit({ name, owner: user?._id || '' })
  }

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
          <button type="button" onClick={() => navigate('/courses')}>Cancel</button>        </div>
      </form>
    </div>
  )
}

export default CourseEdit