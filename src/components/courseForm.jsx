import { useState, useEffect } from 'react'

const CourseForm = ({ course, onSubmit, onCancel, user }) => {
  const [name, setName] = useState('')

  useEffect(() => {
    if (course) {
      setName(course.name)
    }
  }, [course])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ name, owner: user?.id || '' })
  }

  return (
    <div className="course-form">
      <h2>{course ? 'Edit Course' : 'Create New Course'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course Name:</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={event => setName(event.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-sm">
            {course ? 'Update Course' : 'Create Course'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-cancel">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CourseForm