import { useEffect, useState } from 'react'
import { getTestById } from '@/services/testService/fetchService'

export const useTest = (testId: string) => {
  const [test, setTest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await getTestById(testId)
        setTest(data)
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки')
      } finally {
        setLoading(false)
      }
    }

    fetchTest()
  }, [testId])

  return { test, loading, error }
}
