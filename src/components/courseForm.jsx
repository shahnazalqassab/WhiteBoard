import { useState, useEffect } from 'react'

const emptyLesson = {
  title: '',
  material: '',
  assignment: {
    title: '',
    material: '',
    document: ''
  }
}
const CourseForm = ({ course, onSubmit, onCancel, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    lessons: [{ ...emptyLesson }],
    owner: user?.id || ''
  })

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        lessons: course.lessons && course.lessons.length > 0
          ? course.lessons.map(lesson => ({
              title: lesson.title,
              material: lesson.material,
              assignment: lesson.assignment
                ? {
                    title: lesson.assignment.title,
                    material: lesson.assignment.material,
                    document: lesson.assignment.document || ''
                  }
                : { title: '', material: '', document: '' }
            }))
          : [ { ...emptyLesson } ],
        owner: course.owner
      })
    }
  }, [course, user])

const handleChange = (event, lessonId, assignment) => {
    const { name, value } = event.target
    setFormData(prev => {
      const lessons = [...prev.lessons]
      if (assignment) {
        lessons[lessonId].assignment = {
          ...lessons[lessonId].assignment,
          [assignment]: value
        }
      } else {
        lessons[lessonId][name] = value
      }
      return { ...prev, lessons }
    })
  }

  const handleAddLesson = () => {
    setFormData(prev => ({
      ...prev,
      lessons: [ ...prev.lessons, { ...emptyLesson } ]
    }))
  }

  const handleRemoveLesson = (id) => {
    setFormData(prev => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== id)
    }))
  }
  const handleSubmit = (event) => {
    event.preventDefault()
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
            onChange={event => setFormData({ ...formData, name: event.target.value })}
            required
          />
        </div>

        {formData.lessons.map((lesson, id) => (
          <div className="lesson-block" key={id}>
            <h3>Lesson {id + 1}</h3>
            <div className="form-group">
              <label>Lesson Title:</label>
              <input
                type="text"
                name="title"
                value={lesson.title}
                onChange={event => handleChange(event, id)}
                required
              />
            </div>
            <div className="form-group">
              <label>Lesson Material:</label>
              <textarea
                name="material"
                value={lesson.material}
                onChange={event => handleChange(event, id)}
                required
              />
            </div>
            <div className="assignment-block">
              <h4 style={{ margin: '1rem 0 0.5rem 0' }}>Assignment (optional)</h4>
              <div className="form-group">
                <label>Assignment Title:</label>
                <input
                  type="text"
                  value={lesson.assignment?.title || ''}
                  onChange={event => handleChange(
                    { target: { value: event.target.value } }, id, 'title'
                  )}
                />
              </div>
              <div className="form-group">
                <label>Assignment Material:</label>
                <textarea
                  value={lesson.assignment?.material || ''}
                  onChange={event => handleChange(
                    { target: { value: event.target.value } }, id, 'material'
                  )}
                />
              </div>
              <div className="form-group">
                <label>Assignment Document URL (optional):</label>
                <input
                  type="url"
                  value={lesson.assignment?.document || ''}
                  onChange={event => handleChange(
                    { target: { value: event.target.value } }, id, 'document'
                  )}
                />
              </div>
            </div>
            {formData.lessons.length > 1 && (
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => handleRemoveLesson(id)}
              >
                Remove Lesson
              </button>
            )}
            <hr/>
          </div>
        ))}

        <div className="form-actions">
          <button type="button" className="btn btn-sm" onClick={handleAddLesson}>
            Add Lesson
          </button>
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