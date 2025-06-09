
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CourseList from '../components/courseList'
import CourseForm from '../components/courseForm'
import { GetCourses, CreateCourse, UpdateCourse, DeleteCourse } from '../services/Courses'

const Courses = ({ user }) => {
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCourses = async () => {
        try {
            const data = await GetCourses()
            setCourses(data)
        } catch (error) {
            console.error('Error fetching courses:', error)
        }
        }
        fetchCourses()
    }, [])

    const handleCreate = async (courseData) => {
        try {
        const newCourse = await CreateCourse({ ...courseData, owner: user._id })
        setCourses([...courses, newCourse])
        setShowForm(false)
        } catch (error) {
        console.error('Error creating course:', error)
        }
    }

    const handleUpdate = async (id, courseData) => {
        try {
        const updatedCourse = await UpdateCourse(id, courseData)
        setCourses(courses.map(course => 
            course._id === id ? updatedCourse : course
        ))
        setSelectedCourse(null)
        setShowForm(false)
        } catch (error) {
        console.error('Error updating course:', error)
        }
    }

    const handleDelete = async (id) => {
        try {
        await DeleteCourse(id)
        setCourses(courses.filter(course => course._id !== id))
        } catch (error) {
        console.error('Error deleting course:', error)
        }
    }

    const handleViewCourse = (id) => {
        navigate(`/courses/${id}`)
    }

    return (
        <div className="courses-page">
        <h1>Courses</h1>
            {user && user.category === 'teacher' && (
            <button 
                onClick={() => {
                setSelectedCourse(null)
                setShowForm(true)
                }}
                className="btn btn-primary"
            >
                Create New Course
            </button>
            )}
        
        {showForm && (
            <CourseForm 
            course={selectedCourse} 
            onSubmit={selectedCourse ? 
                (data) => handleUpdate(selectedCourse._id, data) : 
                handleCreate
            }
            onCancel={() => setShowForm(false)}
            user={user}
            />
        )}
        
        <CourseList 
            courses={courses} 
            onEdit={(course) => {
            setSelectedCourse(course)
            setShowForm(true)
            }}
            onDelete={handleDelete}
            onView={handleViewCourse}
            user={user}
        />
        </div>
    )
}

export default Courses