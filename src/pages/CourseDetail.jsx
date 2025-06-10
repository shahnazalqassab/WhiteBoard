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
  const [newLesson, setNewLesson] = useState({ title: '', material: '', assignments: [] })
  const [showAssignmentForm, setShowAssignmentForm] = useState(false)
  const [newAssignment, setNewAssignment] = useState({ title: '', material: '', document: '' })

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
    setNewLesson({ title: '', material: '', assignments: [] })
    setShowLessonModal(true)
    setShowAssignmentForm(false)
    setNewAssignment({ title: '', material: '', document: '' })
  }

  const closeLessonModal = () => setShowLessonModal(false)

  const addAssignmentToLesson = () => {
    setNewLesson(prev => ({
      ...prev,
      assignments: [...(prev.assignments || []), newAssignment]
    }))
    setShowAssignmentForm(false)
    setNewAssignment({ title: '', material: '', document: '' })
  }

  const addLesson = async () => {
    try {
      const updatedLessons = [...(course.lessons || []), newLesson]
      await UpdateCourse(id, { ...course, lessons: updatedLessons })
      setCourse(prev => ({ ...prev, lessons: updatedLessons }))
      setShowLessonModal(false)
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

      {course.lessons && course.lessons.length > 0 ? (
        course.lessons.map((lesson, id) => (
          <div className="lesson-section" key={id}>
            <h2>Lesson: {lesson.title}</h2>
            <div className="lesson-material">
              <h3>Material:</h3>
              <a href={lesson.material} target="_blank" rel="noopener noreferrer">
                View Lesson Material
              </a>
            </div>
            {lesson.assignments && lesson.assignments.length > 0 ? (
              lesson.assignments.map((assignment, aIdx) => (
                <div className="assignment" key={aIdx}>
                  <h3>Assignment: {assignment.title}</h3>
                  <div>{assignment.material}</div>
                  {assignment.document && (
                    <a
                      className="button-document"
                      href={assignment.document}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Assignment Document
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div>No assignments for this lesson.</div>
            )}
          </div>
        ))
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
            <div>
              <button type="button" onClick={() => setShowAssignmentForm(!showAssignmentForm)}>
                {showAssignmentForm ? 'Cancel Assignment' : 'Add Assignment'}
              </button>
              {showAssignmentForm && (
                <div className="assignment-form">
                  <input
                    type="text"
                    placeholder="Assignment Title"
                    value={newAssignment.title}
                    onChange={e => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <textarea
                    placeholder="Assignment Description"
                    value={newAssignment.material}
                    onChange={e => setNewAssignment(prev => ({ ...prev, material: e.target.value }))}
                  />
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
                  <button
                    type="button"
                    onClick={addAssignmentToLesson}
                    disabled={!newAssignment.title || !newAssignment.material}
                  >
                    Add Assignment to Lesson
                  </button>
                </div>
              )}
              {newLesson.assignments && newLesson.assignments.length > 0 && (
                <ul>
                  {newLesson.assignments.map((a, idx) => (
                    <li key={idx}>{a.title}</li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
              onClick={addLesson}
              disabled={!newLesson.title || !newLesson.material}
            >
              Add Lesson
            </button>
            <button type="button" onClick={closeLessonModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseDetail
