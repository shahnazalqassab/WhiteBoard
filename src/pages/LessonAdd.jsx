import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { GetCourseById, UpdateCourse } from '../services/Courses'

const LessonAdd = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [lesson, setLesson] = useState({
        title: '',
        material: '', // will hold the file URL
        assignments: []
    })
    const [assignment, setAssignment] = useState({
        title: '',
        material: '', // description
        document: ''
    })
    const [assignments, setAssignments] = useState([])
    const [error, setError] = useState(null)

    const handleFileUpload = async (e, cb) => {
        const file = e.target.files[0]
        if (!file) return
        const fakeUrl = URL.createObjectURL(file)
        cb(fakeUrl)
    }

    const handleLessonChange = (e) => {
        setLesson({ ...lesson, [e.target.name]: e.target.value })
    }

    const handleAssignmentChange = (e) => {
        setAssignment({ ...assignment, [e.target.name]: e.target.value })
    }

    const addAssignment = () => {
        setAssignments([...assignments, assignment])
        setAssignment({ title: '', material: '', document: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const course = await GetCourseById(id)
            const updatedLessons = [...(course.lessons || []), { ...lesson, assignments }]
            await UpdateCourse(id, { ...course, lessons: updatedLessons })
            navigate(`/courses/${id}`)
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="lesson-add-form">
            <h2>Add Lesson</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Lesson Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={lesson.title}
                        onChange={handleLessonChange}
                        required
                    />
                </div>
                <div>
                    <label>Lesson Material (PDF):</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={e => handleFileUpload(e, url => setLesson(prev => ({ ...prev, material: url })))}
                        required
                    />
                    {lesson.material && <a href={lesson.material} target="_blank" rel="noopener noreferrer">Preview Material</a>}
                </div>
                <hr />
                <h4>Add Assignments (optional)</h4>
                <div>
                    <label>Assignment Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={assignment.title}
                        onChange={handleAssignmentChange}
                    />
                </div>
                <div>
                    <label>Assignment Description:</label>
                    <textarea
                        name="material"
                        value={assignment.material}
                        onChange={handleAssignmentChange}
                    />
                </div>
                <div>
                    <label>Assignment Document (PDF):</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={e => handleFileUpload(e, url => setAssignment(prev => ({ ...prev, document: url })))}
                    />
                    {assignment.document && <a href={assignment.document} target="_blank" rel="noopener noreferrer">Preview Document</a>}
                </div>
                <button type="button" onClick={addAssignment} disabled={!assignment.title || !assignment.material}>
                    Add Assignment
                </button>
                <ul>
                    {assignments.map((a, idx) => (
                        <li key={idx}>{a.title}</li>
                    ))}
                </ul>
                <hr />
                <button type="submit" disabled={!lesson.title || !lesson.material}>Add Lesson to Course</button>
                <button type="button" onClick={() => navigate(`/courses/${id}`)}>Cancel</button>
            </form>
        </div>
    )
}

export default LessonAdd