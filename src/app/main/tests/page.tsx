'use client'

import { useEffect, useState } from 'react'
import { fetchNormalTests, fetchTestModule } from '@/services/testService'
import TestTabs from '@/components/NormalTestList'
import ModuleList from '@/components/ModuleList'

interface Test {
  _id: string
  title: string
  questionCount: number
  createdAt: string
}

interface Module {
  _id: string
  originalFileName: string
  createdAt: string
}

const TestPage = () => {
  const [normalTests, setNormalTests] = useState<Test[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'normal' | 'multi'>('normal')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [normal, fetchedModules] = await Promise.all([
          fetchNormalTests(),
          fetchTestModule()
        ])
        setNormalTests(normal)
        setModules(fetchedModules)
      } catch (err) {
        console.error('Ошибка загрузки данных:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  console.log('Normal Tests:', normalTests)
  console.log('Modules:', modules)
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Мои тесты</h1>

      <div className="flex space-x-4 border-b pb-2 mb-4">
        <button
          className={`pb-1 border-b-2 ${
            activeTab === 'normal'
              ? 'border-blue-600 text-blue-600 font-medium'
              : 'border-transparent text-gray-600'
          }`}
          onClick={() => setActiveTab('normal')}
        >
          Обычные тесты
        </button>
        <button
          className={`pb-1 border-b-2 ${
            activeTab === 'multi'
              ? 'border-blue-600 text-blue-600 font-medium'
              : 'border-transparent text-gray-600'
          }`}
          onClick={() => setActiveTab('multi')}
        >
          Мульти-тесты
        </button>
      </div>

      {loading ? (
        <div className="text-gray-600">Загрузка данных...</div>
      ) : activeTab === 'normal' ? (
        <TestTabs normalTests={normalTests} />
      ) : (
        <ModuleList modules={modules} />
      )}
    </div>
  )
}

export default TestPage
