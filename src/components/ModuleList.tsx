'use client'

import React, { useState } from 'react'
import { fetchTestsByModule } from '@/services/testService'
import { useRouter } from 'next/navigation'

interface Module {
  _id: string
  originalFileName: string
  createdAt: string
}

interface Test {
  _id: string
  title: string
  questionCount: number
  difficulty: string
  createdAt: string
}

interface ModuleListProps {
  modules: Module[]
}

const ModuleList: React.FC<ModuleListProps> = ({ modules }) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleModuleClick = async (moduleId: string) => {
    if (selectedModuleId === moduleId) {
      setSelectedModuleId(null)
      setTests([])
      return
    }

    setSelectedModuleId(moduleId)
    setLoading(true)
    try {
      const response = await fetchTestsByModule(moduleId)
      if (Array.isArray(response)) {
        setTests(response)
      } else {
        setTests([])
      }
    } catch (err) {
      console.error('Ошибка загрузки тестов:', err)
      setTests([])
    } finally {
      setLoading(false)
    }
  }

  if (!Array.isArray(modules) || modules.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md text-center text-gray-500">
        Нет доступных модулей.
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Модули</h2>
      <ul className="space-y-6">
        {modules.map((module) => (
          <li key={module._id}>
            <div
              className="p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => handleModuleClick(module._id)}
            >
              <h3 className="text-lg font-semibold text-gray-800 break-words whitespace-pre-wrap">
                {decodeURIComponent(module.originalFileName)}
              </h3>
              <p className="text-sm text-gray-600">
                Дата: {new Date(module.createdAt).toLocaleDateString()}
              </p>
            </div>

            {selectedModuleId === module._id && (
              <div className="mt-4 pl-4 border-l-2 border-blue-200">
                {loading ? (
                  <p className="text-sm text-blue-600">Загрузка тестов...</p>
                ) : Array.isArray(tests) && tests.length === 0 ? (
                  <p className="text-sm text-gray-500">Нет тестов для этого модуля.</p>
                ) : (
                  <ul className="space-y-3">
                    {tests.map((test) => (
                      <li
                        key={test._id}
                        className="p-3 bg-white rounded-xl shadow border flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                      >
                        <div>
                          <h4 className="text-md font-semibold text-gray-800">{test.title}</h4>
                          <p className="text-sm text-gray-600">
                            Вопросов: {test.questionCount} • Сложность: {test.difficulty} •{' '}
                            {new Date(test.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => router.push(`/main/tests/passing/${test._id}`)}
                          >
                            Пройти
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
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ModuleList
