import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GetCourseById, DeleteCourse, UpdateCourse } from '../services/Courses'

const CourseDetail = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [newLesson, setNewLesson] = useState({ title: '', description: '', material: '', assignment: null })
  const [showAssignmentForm, setShowAssignmentForm] = useState(false)
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', document: '' })

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

  const handleFileUpload = async (e, cb) => {
    const file = e.target.files[0]
    if (!file) return
    const fakeUrl = URL.createObjectURL(file)
    cb(fakeUrl)
  }

  const openLessonModal = () => {
    setNewLesson({ title: '', description: '', material: '', assignment: null })
    setShowLessonModal(true)
    setShowAssignmentForm(false)
    setNewAssignment({ title: '', description: '', document: '' })
  }

  const closeLessonModal = () => setShowLessonModal(false)

  const addAssignmentToLesson = () => {
    setNewLesson(prev => ({
      ...prev,
      assignment: {
        title: newAssignment.title || '',
        description: newAssignment.description || '',
        document: newAssignment.document || ''
      }
    }))
    setShowAssignmentForm(false)
    setNewAssignment({ title: '', description: '', document: '' })
  }

  const addLesson = async () => {
    try {
      // Always use the latest assignment state if the assignment form is open
      let assignment = newLesson.assignment;
      if (
        showAssignmentForm &&
        (newAssignment.title || newAssignment.description || newAssignment.document)
      ) {
        assignment = {
          title: newAssignment.title,
          description: newAssignment.description,
          document: newAssignment.document
        }
      }
      const lessonToAdd = {
        title: newLesson.title,
        description: newLesson.description || '',
        material: newLesson.material || '',
        assignment: assignment || undefined
      }
      // Update local state immediately for instant feedback
      const updatedLessons = [...(course.lessons || []), lessonToAdd]
      setCourse(prev => ({
        ...prev,
        lessons: updatedLessons
      }))
      setShowLessonModal(false)
      // Update backend in background
      await UpdateCourse(id, { ...course, lessons: updatedLessons })
      // Optionally refresh from backend after save
      // const freshCourse = await GetCourseById(id)
      // setCourse(freshCourse)
    } catch (err) {
      setError(err.message)
    }
  }

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
      <button onClick={() => navigate('/courses')}>Back to Courses</button>
      <h1>{course.name}</h1>
      <p>Instructor: {course.owner?.name || 'Unknown'}</p>
      <p>Description: {course.description}</p>

      {course.lessons && course.lessons.length > 0 ? (
        course.lessons.map((lesson, id) => {
          return (
            <div className="lesson-section" key={id}>
              <h2>Lesson: {lesson.title}</h2>
              <div className="lesson-material">
                <h3>Description:</h3>
                <div>{lesson.description}</div>
                {lesson.material && (
                  <a href={lesson.material} target="_blank" rel="noopener noreferrer">
                    View Lesson Material
                  </a>
                )}
              </div>
              {lesson.assignment ? (
                <div className="assignment">
                  <h3>Assignment: {lesson.assignment.title}</h3>
                  <div>{lesson.assignment.description}</div>
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
              ) : (
                <div>No assignments for this lesson.</div>
              )}
            </div>
          )
        })
      ) : (
        <div className="lessons-message">
          No lessons have been added to this course yet.
        </div>
      )}

      {user && user._id === course.owner?._id && (
        <div className="course-actions">
          <button onClick={handleEdit}>Edit Course</button>
          <button onClick={openLessonModal}>Add Lesson</button>
        </div>
      )}

      {user && user.category === 'student' && course.owner?._id !== user._id && (
        <div className="enroll-section">
          {course.students?.some(s => s._id === user._id) ? (
            <span className="enrolled-msg">You are enrolled in this course.</span>
          ) : course.pendingEnrollments?.some(s => s._id === user._id) ? (
            <span className="pending-msg">Enrollment request pending approval.</span>
          ) : (
            <button
              onClick={async () => {
                try {
                  await fetch(`/courses/${course._id}/enroll`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                  })
                  alert('Enrollment request sent!')
                  window.location.reload()
                } catch (err) {
                  alert('Failed to send enrollment request.')
                }
              }}
            >
              Enroll
            </button>
          )}
        </div>
      )}

      {user && user._id === course.owner?._id && course.pendingEnrollments?.length > 0 && (
        <section className="pending-enrollments-section">
          <h2>Pending Enrollment Requests</h2>
          <ul>
            {course.pendingEnrollments.map(student => (
              <li key={student._id} style={{ marginBottom: '1em' }}>
                <span>
                  <strong>{student.name}</strong> ({student.email})
                </span>
                <button
                  style={{ marginLeft: '1em', background: 'green', color: 'white' }}
                  onClick={async () => {
                    await fetch(`/courses/${course._id}/enrollments/${student._id}/accept`, {
                      method: 'POST',
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                      },
                    })
                    window.location.reload()
                  }}
                >
                  Accept
                </button>
                <button
                  style={{ marginLeft: '0.5em', background: 'red', color: 'white' }}
                  onClick={async () => {
                    await fetch(`/courses/${course._id}/enrollments/${student._id}/decline`, {
                      method: 'POST',
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                      },
                    })
                    window.location.reload()
                  }}
                >
                  Decline
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {showLessonModal && (
        <div className="modal">
          <div className="modal-content course-form" style={{ maxWidth: 430 }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Add Lesson</h2>
            <form>
              <div className="form-group">
                <label>Lesson Title:</label>
                <input
                  type="text"
                  value={newLesson.title}
                  onChange={e => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Lesson Description:</label>
                <textarea
                  value={newLesson.description}
                  onChange={event => setNewLesson(prev => ({ ...prev, description: event.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Lesson Material (PDF):</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={e => handleFileUpload(e, url => setNewLesson(prev => ({ ...prev, material: url })))}
                />
                {newLesson.material && (
                  <a href={newLesson.material} target="_blank" rel="noopener noreferrer">
                    Preview Lesson Material
                  </a>
                )}
              </div>
              <div className="assignments-section" style={{ marginTop: 12 }}>
                <h5>Assignment</h5>
                <button
                  type="button"
                  onClick={() => setShowAssignmentForm(!showAssignmentForm)}
                  style={{ marginBottom: 8 }}
                  disabled={!!newLesson.assignment}
                >
                  {showAssignmentForm ? 'Cancel Assignment' : (newLesson.assignment ? 'Assignment Added' : 'Add Assignment')}
                </button>
                {showAssignmentForm && (
                  <div className="assignment-form" style={{ marginTop: 8 }}>
                    <div className="form-group">
                      <label>Assignment Title:</label>
                      <input
                        type="text"
                        value={newAssignment.title}
                        onChange={e => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Assignment Description:</label>
                      <textarea
                        value={newAssignment.description}
                        onChange={e => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Assignment Document (PDF):</label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={e => handleFileUpload(e, url => setNewAssignment(prev => ({ ...prev, document: url })))}
                      />
                      {newAssignment.document && (
                        <a href={newAssignment.document} target="_blank" rel="noopener noreferrer">
                          Preview Document
                        </a>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={addAssignmentToLesson}
                      disabled={!newAssignment.title || !newAssignment.description}
                      style={{ marginTop: 8 }}
                    >
                      Add Assignment to Lesson
                    </button>
                  </div>
                )}
                {newLesson.assignment && (
                  <ul>
                    <li>{newLesson.assignment.title}</li>
                  </ul>
                )}
              </div>
              <div className="form-actions" style={{ marginTop: 16 }}>
                <button
                  type="button"
                  onClick={addLesson}
                  disabled={!newLesson.title}
                >
                  Add Lesson
                </button>
                <button type="button" onClick={closeLessonModal} style={{ marginLeft: 8 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseDetail
