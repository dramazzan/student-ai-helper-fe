"use client"

import { useRouter } from "next/navigation"
import { Brain, Sparkles, ArrowRight, BookOpen, Target, TrendingUp, Zap } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const features = [
    {
      icon: BookOpen,
      title: "Создание тестов",
      description: "Генерация из PDF и DOCX",
    },
    {
      icon: Target,
      title: "Персональная аналитика",
      description: "Отслеживание прогресса",
    },
    {
      icon: TrendingUp,
      title: "Умные рекомендации",
      description: "ИИ-помощник для обучения",
    },
  ]
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-[#C8102E] rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-800" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
              Student AI<span className="block text-[#C8102E]">Helper</span>
            </h1>
            {/* Added "by Narxoz University" text here */}
            <p className="text-lg text-[#C8102E] font-semibold">by Narxoz University</p>
            <p className="text-xl text-[#666666] max-w-2xl mx-auto leading-relaxed">
              Загружайте учебные материалы и получайте тесты, задания и персональные рекомендации с помощью ИИ
            </p>
          </div>
          <div className="pt-4">
            <button
              onClick={() => router.push("/main/dashboard")}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#C8102E] hover:bg-[#B00020] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Начать обучение</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-black mb-3">Возможности платформы</h2>
            <p className="text-[#666666]">Все инструменты для эффективного обучения в одном месте</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group text-center p-6 rounded-xl border border-[#E0E0E0] hover:border-[#C8102E] hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 transition-colors">
                    <Icon className="w-6 h-6 text-[#C8102E]" />
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
                  <p className="text-[#666666]">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
        <div className="mt-20 bg-gray-50 rounded-2xl p-8 border border-[#E0E0E0]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-black mb-2">1000+</div>
              <div className="text-[#666666]">Созданных тестов</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black mb-2">95%</div>
              <div className="text-[#666666]">Точность ИИ</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black mb-2">24/7</div>
              <div className="text-[#666666]">Доступность</div>
            </div>
          </div>
        </div>
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-[#B00020] rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Бесплатно для студентов</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-black mb-3">Готовы улучшить свое обучение?</h3>
            <p className="text-[#666666] mb-6">
              Присоединяйтесь к тысячам студентов, которые уже используют ИИ для обучения
            </p>
            <button
              onClick={() => router.push("/auth/register")}
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#E0E0E0] hover:border-[#C8102E] text-[#666666] hover:text-[#C8102E] font-medium rounded-lg transition-colors"
            >
              <span>Создать аккаунт</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
