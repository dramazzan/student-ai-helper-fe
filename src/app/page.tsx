'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white text-center px-6">
      <Image
        src="/logoGpt.png" // можешь заменить или удалить
        alt="Логотип"
        width={300}
        height={300}
        className="mb-6 rounded-full shadow-md" 
      />
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Добро пожаловать в <span className="text-blue-600">Student AI Helper</span>
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        Загружай учебные материалы и получай тесты, домашние задания и персональные рекомендации с помощью ИИ.
      </p>
      <button
        onClick={() => router.push('/main')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
      >
        Перейти к обучению
      </button>
    </div>
  )
}
