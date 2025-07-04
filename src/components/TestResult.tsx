'use client'

import React, { useEffect, useState } from 'react'
import { getTestResult } from '@/services/testService'
import { useParams, useRouter } from 'next/navigation'

interface QuestionDetail {
  question: string
  selected: number
  correct: number
  isCorrect: boolean
}

interface TestResultData {
  testTitle: string
  testId: string
  score: number
  total: number
  percentage: number
  completedAt: string
  details: QuestionDetail[]
}

const getBadgeClass = (percentage: number) => {
  if (percentage >= 80) return 'bg-green-100 text-green-700'
  if (percentage >= 50) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-700'
}

const TestResult = () => {
  const { resultId } = useParams() as { resultId: string }
  const router = useRouter()
  const [result, setResult] = useState<TestResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getTestResult(resultId)
        setResult(data)
      } catch (err: any) {
        setError('Ошибка при загрузке результата')
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [resultId])

  if (loading) return <p className="text-center text-blue-500">Загрузка результата...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>
  if (!result) return null

  const bestScore = result.percentage
  const testId = result.testId // ✅ теперь используем для маршрутов

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{result.testTitle}</h2>
      <p className="text-gray-600 mb-4">
        Завершено: {new Date(result.completedAt).toLocaleString()}
      </p>

      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-800">Результат:</p>
        <p className="text-xl text-blue-700 font-bold">
          {result.score} / {result.total} ({result.percentage}%)
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {result.details.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded border ${
              item.isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
            }`}
          >
            <p className="font-semibold mb-2">
              {index + 1}. {item.question}
            </p>
            <p
              className={`text-sm ${
                item.isCorrect ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {item.isCorrect ? 'Верно' : 'Неверно'}
            </p>
            {!item.isCorrect && (
              <div className="text-sm text-gray-600 mt-1">
                <p>Ваш ответ: {item.selected + 1}</p>
                <p>Правильный ответ: {item.correct + 1}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 👇 Кнопки внизу */}
      <div className="flex items-center gap-3 flex-wrap mt-6">
        {bestScore > 0 && (
          <span className={`text-sm px-3 py-1 rounded ${getBadgeClass(bestScore)}`}>
            Лучший результат: {bestScore}%
          </span>
        )}
        <button
          onClick={() => router.push(`/main/tests/passing/${testId}`)}
          className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Пройти тест
        </button>
        {bestScore > 0 && (
          <button
            onClick={() => router.push(`/main/tests/history/${testId}`)}
            className="text-sm px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            История
          </button>
        )}
      </div>
    </div>
  )
}

export default TestResult
