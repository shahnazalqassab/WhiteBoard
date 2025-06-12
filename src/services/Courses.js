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

export const GetCoursesByOwner = async (ownerId) => {
  try {
    const response = await Client.get(`/courses/owner/${ownerId}`)
    return Array.isArray(response.data) ? response.data : []
    } catch (error) {
    console.error(`Error fetching courses for owner with id ${ownerId}:`, error)
    return [] 
    }
  }


  export const GetCoursesByStudent = async (studentId) => {
  try {
    const response = await Client.get(`/courses/student/${studentId}`)
    return Array.isArray(response.data) ? response.data : []
    } catch (error) {
    console.error(`Error fetching courses for student with id ${studentId}:`, error)
    return [] 
    }
  }

export const CreateCourse = async (courseData) => {
  try {
    const response = await Client.post('/courses', courseData,
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

export const EnrollInCourse = async (courseId) => {
  try {
    const response = await Client.post(
      `/courses/${courseId}/enroll`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error(`Error enrolling in course with id ${courseId}:`, error)
    throw error
  }
}


export const UnenrollFromCourse = async (courseId) => {
  try {
    const response = await Client.post(
      `/courses/${courseId}/unenroll`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error(`Error un-enrolling from course with id ${courseId}:`, error)
    throw error
  }
}

export const GetEnrolledCourses = async () => {
  try {
    const response = await Client.get('/courses/enrolled', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching enrolled courses:', error)
    throw error
  }
}
