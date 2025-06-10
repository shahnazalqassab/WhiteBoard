import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GetCourseById, UpdateCourse } from '../services/Courses'
import axios from 'axios'
import '../Styles/CourseEdit.css'

const CourseEdit = ({ user }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [users, setUsers] = useState([])
    const [course, setCourse] = useState({
        name: '',
        owner: user?._id || '',
        lessons: []
    })
    const [newLesson, setNewLesson] = useState({
        title: '',
        material: '',
        assignment: {
            title: '',
            material: '',
            document: ''
        }
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseData, usersResponse] = await Promise.all([
                    GetCourseById(id),
                    // FIXED: use correct endpoint
                    // axios.get('/api/users')
                    axios.get('/user')
                ])

                setCourse({
                    ...courseData,
                    owner: courseData.owner?._id || user?._id || ''
                })
                setUsers(usersResponse.data)
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }
        fetchData()
    }, [id, user])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setCourse(prev => ({ ...prev, [name]: value }))
    }

    const handleLessonChange = (e) => {
        const { name, value } = e.target
        setNewLesson(prev => ({ ...prev, [name]: value }))
    }

    const handleAssignmentChange = (e) => {
        const { name, value } = e.target
        setNewLesson(prev => ({
            ...prev,
            assignment: { ...prev.assignment, [name]: value }
        }))
    }

    const addLesson = () => {
        if (newLesson.title && newLesson.material) {
            setCourse(prev => ({
                ...prev,
                lessons: [...prev.lessons, newLesson]
            }))
            setNewLesson({
                title: '',
                material: '',
                assignment: {
                    title: '',
                    material: '',
                    document: ''
                }
            })
        }
    }

    const removeLesson = (index) => {
        setCourse(prev => ({
            ...prev,
            lessons: prev.lessons.filter((_, i) => i !== index)
        }))
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

    if (loading) return <div className="loading">Loading...</div>
    if (error) return <div className="error">Error: {error}</div>

    return (
        <div className="course-edit-container">
            <h2>Edit Course</h2>
            <form onSubmit={handleSubmit} className="course-edit-form">
                <div className="form-group">
                    <label>Course Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={course.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
             
                </div>

                <div className="lessons-section">
                    <h3>Lessons</h3>
                    {course.lessons.length === 0 ? (
                        <p>No lessons added yet</p>
                    ) : (
                        course.lessons.map((lesson, index) => (
                            <div key={index} className="lesson-item">
                                <h4>{lesson.title}</h4>
                                <p>{lesson.material}</p>
                                {lesson.assignment?.title && (
                                    <div className="assignment">
                                        <h5>Assignment: {lesson.assignment.title}</h5>
                                        <p>{lesson.assignment.material}</p>
                                        {lesson.assignment.document && (
                                            <a href={lesson.assignment.document} target="_blank" rel="noopener noreferrer">
                                                View Document
                                            </a>
                                        )}
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className="remove-lesson"
                                    onClick={() => removeLesson(index)}
                                >
                                    Remove Lesson
                                </button>
                            </div>
                        ))
                    )}

                    <div className="add-lesson">
                        <h4>Add New Lesson</h4>
                        <div className="form-group">
                            <label>Lesson Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={newLesson.title}
                                onChange={handleLessonChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Lesson Material:</label>
                            <textarea
                                name="material"
                                value={newLesson.material}
                                onChange={handleLessonChange}
                                required
                            />
                        </div>

                        <div className="assignment-form">
                            <h5>Assignment Details (Optional)</h5>
                            <div className="form-group">
                                <label>Title:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newLesson.assignment.title}
                                    onChange={handleAssignmentChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Material:</label>
                                <textarea
                                    name="material"
                                    value={newLesson.assignment.material}
                                    onChange={handleAssignmentChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Document URL:</label>
                                <input
                                    type="text"
                                    name="document"
                                    value={newLesson.assignment.document}
                                    onChange={handleAssignmentChange}
                                    placeholder="https://example.com/document.pdf"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            className="add-lesson-btn"
                            onClick={addLesson}
                            disabled={!newLesson.title || !newLesson.material}
                        >
                            Add Lesson
                        </button>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="update-btn">
                        Update Course
                    </button>
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate(`/courses/${id}`)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CourseEdit