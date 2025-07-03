'use client'

import React, { useEffect, useState } from 'react'
import { getTestProgressByTestId } from '@/services/testService'
import { useParams } from 'next/navigation'

interface AnswerDetail {
  question: string
  options: string[]
  selectedAnswerIndex: number
  selectedAnswerText: string
  correctAnswerIndex: number
  correctAnswerText: string
  isCorrect: boolean
}

interface Attempt {
  resultId: string
  score: number
  totalQuestions: number
  percentage: number
  completedAt: string
  details: AnswerDetail[]
}

interface TestProgress {
  testTitle: string
  attempts: Attempt[]
}

const TestProgressHistory = () => {
  const { testId } = useParams() as { testId: string }
  const [progress, setProgress] = useState<TestProgress | null>(null)
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getTestProgressByTestId(testId)
        setProgress(data)
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки')
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [testId])

  if (loading) return <p className="text-center text-gray-500">Загрузка истории...</p>

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-16 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 17h.01M4.22 4.22a10 10 0 1115.56 15.56A10 10 0 014.22 4.22z" />
        </svg>
        <h2 className="text-xl font-semibold text-red-600 mb-2">Результаты не найдены</h2>
        <p className="text-gray-600 max-w-md">
          Возможно, вы ещё не проходили этот тест или произошла ошибка при загрузке данных. Попробуйте позже.
        </p>
      </div>
    )
  }

  if (!progress) return null

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">История теста: {progress.testTitle}</h2>

      <ul className="space-y-4">
        {progress.attempts.map((attempt, index) => (
          <li
            key={attempt.resultId}
            className="border p-4 rounded cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedAttempt(attempt)}
          >
            <div className="flex justify-between">
              <div>
                <p className="font-medium">Попытка #{index + 1}</p>
                <p className="text-sm text-gray-600">
                  Дата: {new Date(attempt.completedAt).toLocaleString()}
                </p>
              </div>z
              <div>
                <p>Результат: {attempt.score}/{attempt.totalQuestions}</p>
                <p className="text-sm text-blue-600">{attempt.percentage}%</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selectedAttempt && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Детали попытки</h3>
          {selectedAttempt.details.map((detail, idx) => (
            <div key={idx} className="mb-4">
              <p className="font-medium">{idx + 1}. {detail.question}</p>
              <ul className="list-disc ml-6 mt-1 text-sm">
                {detail.options.map((opt, i) => (
                  <li
                    key={i}
                    className={`
                      ${i === detail.correctAnswerIndex ? 'text-green-600 font-semibold' : ''}
                      ${i === detail.selectedAnswerIndex && !detail.isCorrect ? 'text-red-600' : ''}
                    `}
                  >
                    {opt}
                    {i === detail.correctAnswerIndex && ' (правильный)'}
                    {i === detail.selectedAnswerIndex && !detail.isCorrect && ' (выбранный)'}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TestProgressHistory
