import { useState, useEffect } from 'react'

const CourseForm = ({ course, onSubmit, onCancel, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    lessons: {
      title: '',
      material: '',
      assignment: {
        title: '',
        material: '',
        document: ''
      }
    },
    owner: user?.id || ''
  })

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        lessons: {
          title: course.lessons.title,
          material: course.lessons.material,
          assignment: {
            title: course.lessons.assignment.title,
            material: course.lessons.assignment.material,
            document: course.lessons.assignment.document || ''
          }
        },
        owner: course.owner
      })
    }
  }, [course, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild ? {
            ...prev[parent][child],
            [grandchild]: value
          } : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
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
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Lesson Title:</label>
          <input
            type="text"
            name="lessons.title"
            value={formData.lessons.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Lesson Material:</label>
          <textarea
            name="lessons.material"
            value={formData.lessons.material}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Assignment Title:</label>
          <input
            type="text"
            name="lessons.assignment.title"
            value={formData.lessons.assignment.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Assignment Material:</label>
          <textarea
            name="lessons.assignment.material"
            value={formData.lessons.assignment.material}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Assignment Document URL (optional):</label>
          <input
            type="url"
            name="lessons.assignment.document"
            value={formData.lessons.assignment.document}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-submit">
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