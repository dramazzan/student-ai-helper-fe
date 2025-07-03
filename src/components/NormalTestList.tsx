'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

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
        {normalTests.map((test) => (
          <li
            key={test._id}
            className="p-4 bg-gray-50 rounded-xl shadow border hover:shadow-md transition flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{test.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Вопросов: {test.questionCount} • Сложность: {test.difficulty || 'не указано'} •{' '}
                {new Date(test.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/main/tests/passing/${test._id}`)}
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Пройти тест
              </button>
              <button
                onClick={() => router.push(`/main/tests/history/${test._id}`)}
                className="text-sm px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                История
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NormalTestList
