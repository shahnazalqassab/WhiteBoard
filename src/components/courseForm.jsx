import { useState, useEffect } from 'react'

const CourseForm = ({ course, onSubmit, onCancel, user }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (course) {
      setName(course.name)
      setDescription(course.description)
    }
  }, [course])

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Submitting course:', { name, description, owner: user?._id || '' })
    
    onSubmit({ name, description, owner: user?._id || '' })
  }

  return (
    <div className="course-form">
      <h2>Create New Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course Name:</label>
          <input type="text" name="name" value={name}
            onChange={event => setName(event.target.value)}
            required
          />
          <label>Description:</label>
          <textarea name="description" value={description}
            onChange={event => setDescription(event.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">Create Course</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default CourseForm