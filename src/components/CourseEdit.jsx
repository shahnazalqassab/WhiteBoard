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
  })
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(null)
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    assignments: []
  })
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    document: ''
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

  // Lesson Modal Handlers
  const openLessonModal = () => {
    setNewLesson({ title: '', material: '', assignments: [] })
    setShowLessonModal(true)
  }
  const closeLessonModal = () => setShowLessonModal(false)
  const addLesson = () => {
    setCourse(prev => ({
      ...prev,
      lessons: [...prev.lessons, newLesson]
    }))
    setShowLessonModal(false)
  }

  // Assignment Modal Handlers
  const openAssignmentModal = (lessonIdx) => {
    setCurrentLessonIndex(lessonIdx)
    setNewAssignment({ title: '', material: '', document: '' })
    setShowAssignmentModal(true)
  }
  const closeAssignmentModal = () => setShowAssignmentModal(false)
  const addAssignment = () => {
    setCourse(prev => {
      const lessons = [...prev.lessons]
      lessons[currentLessonIndex].assignments = [
        ...(lessons[currentLessonIndex].assignments || []),
        newAssignment
      ]
      return { ...prev, lessons }
    })
    setShowAssignmentModal(false)
  }

  const removeLesson = (index) => {
    setCourse(prev => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== index)
    }))
  }

  const removeAssignment = (lessonIdx, assignmentIdx) => {
    setCourse(prev => {
      const lessons = [...prev.lessons]
      lessons[lessonIdx].assignments = lessons[lessonIdx].assignments.filter((_, i) => i !== assignmentIdx)
      return { ...prev, lessons }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log(course)
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
          <textarea name="description" value={course.description}
            onChange={event => setCourse(prev => ({ ...prev, description: event.target.value }))}
            required
          />
        </div>
        <div className="form-group">
      
        </div>

        <div className="lessons-section">
          <h3>Lessons</h3>
          {course.lessons.map((lesson, lIdx) => (
            <div key={lIdx} className="lesson-item">
              <h4>{lesson.title}</h4>
              <a href={lesson.material} target="_blank" rel="noopener noreferrer">View Lesson Material</a>
              <button type="button" onClick={() => removeLesson(lIdx)}>Remove Lesson</button>
              <h5>Assignments</h5>
              {(lesson.assignments || []).map((assignment, aIdx) => (
                <div key={aIdx} className="assignment-item">
                  <strong>{assignment.title}</strong>
                  <a href={assignment.material} target="_blank" rel="noopener noreferrer">View Assignment Material</a>
                  <a href={assignment.document} target="_blank" rel="noopener noreferrer">View Document</a>
                  <button type="button" onClick={() => removeAssignment(lIdx, aIdx)}>Remove Assignment</button>
                </div>
              ))}
              <button type="button" onClick={() => openAssignmentModal(lIdx)}>Add Assignment</button>
            </div>
          ))}
          <button type="button" onClick={openLessonModal}>Add Lesson</button>
        </div>

        <div className="form-actions">
          <button type="submit" className="update-btn">Update Course</button>
          <button type="button" className="cancel-btn" onClick={() => navigate(`/courses/${id}`)}>Cancel</button>
        </div>
      </form>

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>Add Lesson</h4>
            <input
              type="text"
              placeholder="Lesson Title"
              value={newLesson.title}
              onChange={e => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={e => handleFileUpload(e, url => setNewLesson(prev => ({ ...prev, material: url })))}
              required
            />
            {newLesson.material && (
              <a href={newLesson.material} target="_blank" rel="noopener noreferrer">
                Preview Lesson Material
              </a>
            )}
            <button type="button" onClick={addLesson} disabled={!newLesson.title || !newLesson.material}>
              Add Lesson
            </button>
            <button type="button" onClick={closeLessonModal}>Cancel</button>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>Add Assignment</h4>
            <input
              type="text"
              placeholder="Assignment Title"
              value={newAssignment.title}
              onChange={e => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <textarea
              placeholder="Assignment Description"
              value={newAssignment.material}
              onChange={e => setNewAssignment(prev => ({ ...prev, material: e.target.value }))}
              required
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={e => handleFileUpload(e, url => setNewAssignment(prev => ({ ...prev, document: url })))}
            />
            {newAssignment.document && <a href={newAssignment.document} target="_blank" rel="noopener noreferrer">Preview Document</a>}
            <button type="button" onClick={addAssignment} disabled={!newAssignment.title || !newAssignment.material}>Add Assignment</button>
            <button type="button" onClick={closeAssignmentModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseEdit