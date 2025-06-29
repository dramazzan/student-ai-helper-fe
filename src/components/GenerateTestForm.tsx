'use client'

import React, { useState } from 'react'
import { generateTest, generateMultiTest } from '@/services/testService'
import { UploadCloud } from 'lucide-react'

const GenerateTestForm = () => {
  const [file, setFile] = useState<File | null>(null)
  const [difficulty, setDifficulty] = useState('средний')
  const [questionCount, setQuestionCount] = useState(5)
  const [questionType, setQuestionType] = useState('тест с выбором')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'normal' | 'multi'>('normal')

  const handleSubmit = async () => {
    if (!file) return alert('Выберите файл!')
    setLoading(true)
    try {
      if (activeTab === 'normal') {
        const result = await generateTest(file, { difficulty, questionCount, questionType })
        console.log('✅ Обычный тест создан:', result)
      } else {
        const result = await generateMultiTest(file, { difficulty, questionCount })
        console.log('✅ Мульти тесты созданы:', result)
      }
      alert('Тест(ы) успешно созданы!')
    } catch (err: any) {
      console.error(err)
      alert(err?.response?.data?.message || 'Ошибка при генерации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <UploadCloud className="w-5 h-5 text-blue-600" />
        Генерация теста из файла
      </h2>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'normal' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('normal')}
        >
          Обычный тест
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ml-4 ${activeTab === 'multi' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('multi')}
        >
          Мульти тест
        </button>
      </div>

      {/* File input */}
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
        className="w-full p-2 border border-gray-300 rounded-md"
      />

      {/* Common Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Сложность</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="лёгкий">Лёгкий</option>
            <option value="средний">Средний</option>
            <option value="сложный">Сложный</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Количество вопросов</label>
          <input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            min={1}
            max={50}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      {/* Только для обычного теста */}
      {activeTab === 'normal' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Тип вопроса</label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="тест с выбором">Тест с выбором</option>
            <option value="открытые">Открытые</option>
            <option value="с одним выбором">С одним выбором</option>
            <option value="с несколькими">С несколькими</option>
          </select>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        {loading ? 'Генерация...' : 'Сгенерировать тест'}
      </button>
    </div>
  )
}

export default GenerateTestForm
