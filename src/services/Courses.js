import Client from './api'

export const Courses = async () => {
  try {
    const res = await Client.get('/courses')
    return res.data
  } catch (error) {
    throw error
  }
}