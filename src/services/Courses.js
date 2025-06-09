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
    const response = await Client.post(
      '/courses',
      courseData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error creating course:', error)
    throw error
  }
}

export const UpdateCourse = async (id, courseData) => {
  try {
    const response = await Client.put(
      `/courses/${id}`,
      courseData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error(`Error updating course with id ${id}:`, error)
    throw error
  }
}

export const DeleteCourse = async (id) => {
  console.log(id);
  try {
    const response = await Client.delete(
      `/courses/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error(`Error deleting course with id ${id}:`, error)
    throw error
  }
}