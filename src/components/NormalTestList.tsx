'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTestProgressByTestId } from '@/services/testService'

interface Test {
  _id: string
  title: string
  questionCount: number
  difficulty: string
  createdAt: string
}

interface TestTabsProps {
  normalTests: Test[]
}

const NormalTestList: React.FC<TestTabsProps> = ({ normalTests }) => {
  const router = useRouter()
  const [progressMap, setProgressMap] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProgress = async () => {
      const newProgressMap: Record<string, number> = {}

      await Promise.all(
        normalTests.map(async (test) => {
          try {
            const data = await getTestProgressByTestId(test._id)
            const best = Math.max(...data.attempts.map((a: { percentage: number }) => a.percentage))
            newProgressMap[test._id] = best
          } catch {
            newProgressMap[test._id] = 0 // Если не найдено, считаем как "не пройден"
          }
        })
      )

      setProgressMap(newProgressMap)
      setIsLoading(false)
    }

    loadProgress()
  }, [normalTests])

  const getBadgeClass = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800'
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md text-center text-blue-600 animate-pulse">
        Загрузка тестов и прогресса...
      </div>
    )
  }

  if (!normalTests.length) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md text-center text-gray-500">
        Нет доступных тестов.
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Обычные тесты</h2>
      <ul className="space-y-4">
        {normalTests.map((test) => {
          const bestScore = progressMap[test._id]

          return (
            <li
              key={test._id}
              className="p-4 bg-gray-50 rounded-xl shadow border hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{test.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Вопросов: {test.questionCount} • Сложность: {test.difficulty || 'не указано'} •{' '}
                  {new Date(test.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {bestScore > 0 && (
                  <span
                    className={`text-sm px-3 py-1 rounded ${getBadgeClass(bestScore)}`}
                  >
                    Лучший результат: {bestScore}%
                  </span>
                )}
                <button
                  onClick={() => router.push(`/main/tests/passing/${test._id}`)}
                  className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Пройти тест
                </button>
                {bestScore > 0 && (
                  <button
                    onClick={() => router.push(`/main/tests/history/${test._id}`)}
                    className="text-sm px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                  >
                    История
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default NormalTestList
