'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTest } from '@/hooks/useTest'
import { submitTestAnswers } from '@/services/testService'

const TestTakingForm = () => {
  const { testId } = useParams() as { testId: string }
  const { test, loading, error } = useTest(testId)
  const [answers, setAnswers] = useState<{ [key: string]: number }>({})
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const handleAnswerChange = (questionId: string, selected: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: selected }))
  }

  const handleSubmit = async () => {
    if (!test) return
    const isAllAnswered = test.questions.every((q: { _id: string | number }) => answers[q._id] !== undefined)
    if (!isAllAnswered) {
      alert('Пожалуйста, ответьте на все вопросы.')
      return
    }

    const payload = {
      testId: test._id,
      answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      })),
    }

    try {
      setSubmitting(true)
      const response = await submitTestAnswers(payload)
      alert('Тест успешно сдан!')
      router.push(`/main/tests/passed/${response.resultId || ''}`)
    } catch (error) {
      console.error('Ошибка при отправке теста:', error)
      alert('Произошла ошибка при отправке теста.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Загрузка теста...</p>
  }

  if (error || !test) {
    return <p className="text-center text-red-600 mt-10">Ошибка загрузки теста.</p>
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{test.title}</h2>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
        {test.questions.map((q: any, index: number) => (
          <div key={q._id} className="mb-6">
            <p className="font-medium text-gray-800 mb-2">
              {index + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt: string, idx: number) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={q._id}
                    value={idx}
                    checked={answers[q._id] === idx}
                    onChange={() => handleAnswerChange(q._id, idx)}
                    className="form-radio text-blue-600"
                  />
                  <span className="text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {submitting ? 'Отправка...' : 'Сдать тест'}
        </button>
      </form>
    </div>
  )
}

export default TestTakingForm
