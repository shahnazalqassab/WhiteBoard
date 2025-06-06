import Client from "./api";

// const API_URL = process.env.MONGODB_URI;

export const GetCourses = async () => {
  try {
    const response = await Client.get('/courses')
    return  response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

export const GetCourseById = async (id) => {
  try {
    const response = await Client.get(`/courses/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching course with id ${id}:`, error)
    throw error
  }
}

export const CreateCourse = async (courseData) => {
  try {
    const response = await Client.post(`/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(courseData)
    })
    if (!response.ok) throw new Error('Failed to create course')
    return await response.json()
  } catch (error) {
    console.error('Error creating course:', error)
    throw error
  }
}

export const UpdateCourse = async (id, courseData) => {
  try {
    const response = await Client.put(`/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(courseData)
    })
    if (!response.ok) throw new Error('Failed to update course')
    return await response.json()
  } catch (error) {
    console.error(`Error updating course with id ${id}:`, error)
    throw error
  }
}

export const DeleteCourse = async (id) => {
  try {
    const response = await Client.delete(`/courses/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (!response.ok) throw new Error('Failed to delete course')
    return await response.json()
  } catch (error) {
    console.error(`Error deleting course with id ${id}:`, error)
    throw error
  }
}