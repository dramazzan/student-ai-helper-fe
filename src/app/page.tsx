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
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-800" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
              Student AI
              <span className="block text-blue-600">Helper</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Загружайте учебные материалы и получайте тесты, задания и персональные рекомендации с помощью ИИ
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <button
              onClick={() => router.push("/main/dashboard")}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Начать обучение</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Возможности платформы</h2>
            <p className="text-slate-600">Все инструменты для эффективного обучения в одном месте</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group text-center p-6 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 bg-slate-50 rounded-2xl p-8 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">1000+</div>
              <div className="text-slate-600">Созданных тестов</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">95%</div>
              <div className="text-slate-600">Точность ИИ</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-2">24/7</div>
              <div className="text-slate-600">Доступность</div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Бесплатно для студентов</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Готовы улучшить свое обучение?</h3>
            <p className="text-slate-600 mb-6">
              Присоединяйтесь к тысячам студентов, которые уже используют ИИ для обучения
            </p>
            <button
              onClick={() => router.push("/auth/register")}
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 font-medium rounded-lg transition-colors"
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
