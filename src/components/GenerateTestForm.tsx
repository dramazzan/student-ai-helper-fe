'use client'

import React, { useState } from 'react'
import { generateTest } from '@/services/testService'
import { UploadCloud } from 'lucide-react'

const GenerateTestForm = () => {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const [difficulty, setDifficulty] = useState('средний')
  const [questionCount, setQuestionCount] = useState(5)
  const [questionType, setQuestionType] = useState('тест с выбором')
  const [testType , setTestType] = useState('normal')
  const [loading, setLoading] = useState(false)

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleSubmit = async () => {
    if (!file) return alert('Сначала выберите файл!')
    setLoading(true)
    try {
      const result = await generateTest(file, { difficulty, questionCount, questionType })
      alert('✅ Тест сгенерирован успешно!')
      console.log('Результат:', result)
    } catch (err: any) {
      console.error(err)
      alert(err?.response?.data?.message || 'Ошибка при генерации теста')
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

      <div
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        {file ? (
          <p className="text-gray-700 font-medium">📄 {file.name}</p>
        ) : (
          <p className="text-gray-500">Перетащите файл сюда или выберите ниже</p>
        )}
      </div>

      <input
        type="file"
        accept=".txt,.pdf,.docx"
        onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
        className="w-full p-2 border border-gray-300 rounded-md"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Количество вопросов</label>
          <input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className="w-full p-2 border rounded-md"
            min={1}
            max={50}
          />
        </div>
      </div>

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
