'use client'

import React, { useEffect, useState } from 'react'
import {
  fetchNormalTests,
  fetchMultiTests,
  getTestById,
  downloadTestDocx,
} from '@/services/testService'

import { TestDownloadListProps } from '@/models/Test'

const TestDownloadList = () => {
  const [tests, setTests] = useState<TestDownloadListProps[]>([])
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)
  const [testContentMap, setTestContentMap] = useState<{ [key: string]: any }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTests = async () => {
      try {
        setLoading(true)
        const [normalTests, multiTests] = await Promise.all([
          fetchNormalTests(),
          fetchMultiTests(),
        ])

        const all = [
          ...normalTests.map((t: any) => ({ ...t, type: 'normal' })),
          ...multiTests.map((t: any) => ({ ...t, type: 'multi' })),
        ]

        setTests(all)
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки тестов')
      } finally {
        setLoading(false)
      }
    }

    loadTests()
  }, [])

  const handleSelectTest = async (test: TestDownloadListProps) => {
    setSelectedTestId((prev) => (prev === test._id ? null : test._id))

    if (!testContentMap[test._id]) {
      try {
        const content = await getTestById(test._id)
        setTestContentMap((prev) => ({
          ...prev,
          [test._id]: content,
        }))
      } catch (err: any) {
        console.error('Ошибка при получении содержимого теста:', err)
      }
    }
  }

  const handleDownload = async (testId: string) => {
    try {
      await downloadTestDocx(testId)
    } catch (err) {
      alert('Не удалось скачать файл')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Список тестов</h2>

      {loading && <p>Загрузка...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-3">
        {tests.map((test) => {
          const isSelected = selectedTestId === test._id
          const testContent = testContentMap[test._id]

          return (
            <li
              key={test._id}
              className={`p-4 border rounded transition ${
                isSelected ? 'bg-blue-50 border-blue-400' : ''
              }`}
            >
              <div className="flex justify-between items-center cursor-pointer" onClick={() => handleSelectTest(test)}>
                <div>
                  <p className="font-semibold">{test.title}</p>
                  <span className="text-sm text-gray-500">
                    Тип: {test.type === 'normal' ? 'Обычный' : 'Мульти'}
                  </span>
                </div>
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(test._id)
                  }}
                >
                  Скачать
                </button>
              </div>

              {isSelected && testContent && (
                <div className="mt-4 bg-white p-4 border rounded shadow-sm">
                  <h3 className="text-md font-bold mb-2">Содержание теста:</h3>
                  <ul className="space-y-4">
                    {testContent.questions?.map((q: any, i: number) => (
                      <li key={i}>
                        <p className="font-medium">
                          {i + 1}. {q.question}
                        </p>
                        <ul className="ml-5 list-disc text-sm">
                          {q.options.map((opt: string, j: number) => (
                            <li key={j}>{opt}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TestDownloadList
