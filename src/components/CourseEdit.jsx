import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GetCourseById, UpdateCourse } from '../services/Courses'

const CourseEdit = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [course, setCourse] = useState({
    name: '',
    owner: '',
    description: '',
    lessons: []
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await GetCourseById(id)
        setCourse({
          ...courseData,
          owner: courseData.owner?._id || ''
        })
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleFileUpload = async (e, cb) => {
    const file = e.target.files[0]
    if (!file) return
    const fakeUrl = URL.createObjectURL(file)
    cb(fakeUrl)
  }

  // Lesson handlers
  const handleLessonChange = (idx, field, value) => {
    setCourse(prev => {
      const lessons = [...prev.lessons]
      lessons[idx] = { ...lessons[idx], [field]: value }
      return { ...prev, lessons }
    })
  }

  const addLesson = () => {
    setCourse(prev => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        { title: '', description: '', material: '', assignment: null }
      ]
    }))
  }

  const removeLesson = (idx) => {
    setCourse(prev => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== idx)
    }))
  }

  // Assignment handlers (single assignment per lesson)
  const handleAssignmentChange = (lIdx, field, value) => {
    setCourse(prev => {
      const lessons = [...prev.lessons]
      const assignment = { ...(lessons[lIdx].assignment || { title: '', description: '', document: '' }) }
      assignment[field] = value
      lessons[lIdx] = { ...lessons[lIdx], assignment }
      return { ...prev, lessons }
    })
  }

  const addAssignment = (lIdx) => {
    setCourse(prev => {
      const lessons = [...prev.lessons]
      lessons[lIdx].assignment = { title: '', description: '', document: '' }
      return { ...prev, lessons }
    })
  }

  const removeAssignment = (lIdx) => {
    setCourse(prev => {
      const lessons = [...prev.lessons]
      lessons[lIdx].assignment = null
      return { ...prev, lessons }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await UpdateCourse(id, course)
      navigate(`/courses/${id}`)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="course-form">
      <h2>Edit Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course Name:</label>
          <input
            type="text"
            name="name"
            value={course.name}
            onChange={event => setCourse(prev => ({ ...prev, name: event.target.value }))}
            required
          />
          <label>Description:</label>
          <textarea
            name="description"
            value={course.description}
            onChange={event => setCourse(prev => ({ ...prev, description: event.target.value }))}
            required
          />
        </div>

        <div className="lessons-section">
          <h3>Lessons</h3>
          {course.lessons.map((lesson, lIdx) => (
            <div key={lIdx} className="lesson-item" style={{ border: '1px solid #ccc', marginBottom: 16, padding: 8 }}>
              <label>Lesson Title:</label>
              <input
                type="text"
                value={lesson.title}
                onChange={e => handleLessonChange(lIdx, 'title', e.target.value)}
                required
              />
              <label>Lesson Description:</label>
              <textarea
                value={lesson.description}
                onChange={e => handleLessonChange(lIdx, 'description', e.target.value)}
                required
              />
              <label>Lesson Material (PDF):</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={e => handleFileUpload(e, url => handleLessonChange(lIdx, 'material', url))}
              />
              {lesson.material && (
                <a href={lesson.material} target="_blank" rel="noopener noreferrer">
                  Preview Lesson Material
                </a>
              )}
              <button type="button" onClick={() => removeLesson(lIdx)} style={{ marginLeft: 8 }}>Remove Lesson</button>
              <div className="assignments-section" style={{ marginTop: 12 }}>
                <h5>Assignment</h5>
                {lesson.assignment ? (
                  <div className="assignment-item" style={{ marginBottom: 8 }}>
                    <label>Assignment Title:</label>
                    <input
                      type="text"
                      value={lesson.assignment.title}
                      onChange={e => handleAssignmentChange(lIdx, 'title', e.target.value)}
                      required
                    />
                    <label>Assignment Description:</label>
                    <textarea
                      value={lesson.assignment.description}
                      onChange={e => handleAssignmentChange(lIdx, 'description', e.target.value)}
                      required
                    />
                    <label>Assignment Document (PDF):</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={e => handleFileUpload(e, url => handleAssignmentChange(lIdx, 'document', url))}
                    />
                    {lesson.assignment.document && (
                      <a href={lesson.assignment.document} target="_blank" rel="noopener noreferrer">
                        Preview Document
                      </a>
                    )}
                    <button type="button" onClick={() => removeAssignment(lIdx)} style={{ marginLeft: 8 }}>Remove Assignment</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => addAssignment(lIdx)}>Add Assignment</button>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={addLesson}>Add Lesson</button>
        </div>

        <div className="form-actions">
          <button type="submit" className="update-btn">Update Course</button>
          <button type="button" className="cancel-btn" onClick={() => navigate(`/courses/${id}`)}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default CourseEdit