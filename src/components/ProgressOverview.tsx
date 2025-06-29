'use client'

import React from 'react'
import {
  LineChart,
  AlertTriangle,
  FolderDown,
  Lightbulb,
} from 'lucide-react'

interface WeakTopic {
  topic: string
  mistakes: number
  recommendation: string
}

interface LowScoreTest {
  title: string
  score: number
  total: number
  date: string
}

interface ProgressData {
  totalTestsTaken: number
  averageScore: number
  progressPercent: number
  weakTopics: WeakTopic[]
  lowScoreTests: LowScoreTest[]
  recommendations: string[]
  motivation: string
}

const ProgressOverview = ({
  data,
  isLoading = false,
}: {
  data?: ProgressData
  isLoading?: boolean
}) => {
  if (isLoading || !data) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-md text-center text-gray-500">
        <p className="animate-pulse">Загрузка прогресса...</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <LineChart className="w-6 h-6 text-blue-600" />
        Учебный прогресс
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Всего тестов пройдено</p>
          <p className="text-xl font-semibold">{data.totalTestsTaken}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Средний балл</p>
          <p className="text-xl font-semibold">{data.averageScore}%</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">Прогресс</p>
          <p className="text-xl font-semibold">{data.progressPercent}%</p>
        </div>
      </div>

     {Array.isArray(data.weakTopics) && data.weakTopics.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-6 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Слабые темы
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {data.weakTopics.map((topic, i) => (
              <li key={i}>
                <strong>{topic.topic}</strong> — {topic.mistakes} ошибок. {topic.recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(data.lowScoreTests) && data.lowScoreTests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-6 mb-2 flex items-center gap-2">
            <FolderDown className="w-5 h-5 text-orange-500" />
            Тесты с низкими баллами
          </h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {data.lowScoreTests.map((test, i) => (
              <li key={i}>
                <span className="font-medium">{test.title}</span> — {test.score}/{test.total} (
                {new Date(test.date).toLocaleDateString()})
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.motivation && (
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border-l-4 border-purple-400 flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-purple-600 mt-1" />
          <p className="text-sm italic text-purple-800">{data.motivation}</p>
        </div>
      )}
    </div>
  )
}

export default ProgressOverview
