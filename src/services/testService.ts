import api from './api'

export const generateTest = async (
  file: File,
  options: {
    difficulty: string
    questionCount: number
    questionType: string
  }
) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('difficulty', options.difficulty)
  formData.append('questionCount', String(options.questionCount))
  formData.append('questionType', options.questionType)

  const response = await api.post('/test/generate-test', formData, 
    {  headers: {
      'Content-Type': 'multipart/form-data',
    }}
  )
  return response.data
}
