"use client"

import type React from "react"
import { type FormEvent, useState } from "react"
import type { LoginDto } from "@/models/User"
import { login } from "@/services/auth"
import { useRouter } from "next/navigation"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  AlertCircle,
  CheckCircle,
  Brain,
  BookOpen,
  TrendingUp,
  Target,
  Award,
  Shield,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const LoginPage = () => {
  const router = useRouter()
  const [loginData, setLoginData] = useState<LoginDto>({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await login(loginData)
      if (response.success) {
        router.push("/main/dashboard")
      } else {
        setError(response.message || "Ошибка входа")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Что-то пошло не так")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    })
  }

  const features = [
    {
      icon: BookOpen,
      title: "Создание тестов",
      description: "Генерация из PDF и DOCX файлов",
    },
    {
      icon: TrendingUp,
      title: "Отслеживание прогресса",
      description: "Анализ результатов и улучшений",
    },
    {
      icon: Target,
      title: "Персональная аналитика",
      description: "Рекомендации по слабым местам",
    },
    {
      icon: Award,
      title: "Система достижений",
      description: "Награды за успешное обучение",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Desktop Only */}
      <div className="hidden lg:flex lg:w-1/2 bg-white border-r border-[#E0E0E0] p-12">
        <div className="flex flex-col justify-center max-w-lg mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-[#C8102E] rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black">Student AI Helper</h1>
              <p className="text-[#666666] text-sm">Умный помощник студента</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-black mb-4">Добро пожаловать в будущее обучения</h2>
              <p className="text-[#666666] text-lg leading-relaxed">
                Авторизуйтесь для получения полного доступа к инструментам создания тестов и отслеживания прогресса.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#C8102E]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">{feature.title}</h3>
                      <p className="text-[#666666] text-sm">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-[#E0E0E0]">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-[#666666]" />
                <h3 className="font-semibold text-black">Безопасность данных</h3>
              </div>
              <p className="text-[#666666] text-sm">
                Ваши данные защищены современными методами шифрования. Гарантируем конфиденциальность и безопасность.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#C8102E] rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-black">Student AI Helper</h1>
              <p className="text-[#666666] text-sm">Умный помощник студента</p>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#E0E0E0] p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">Вход в аккаунт</h2>
              <p className="text-[#666666]">Войдите, чтобы продолжить обучение</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-black">
                  Email адрес
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#666666]" />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={handleChange}
                    value={loginData.email}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E] text-black placeholder-[#666666]"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-black">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#666666]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    onChange={handleChange}
                    value={loginData.password}
                    placeholder="Введите пароль"
                    className="w-full pl-10 pr-12 py-3 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E] text-black placeholder-[#666666]"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-[#666666] hover:text-black" />
                    ) : (
                      <Eye className="h-5 w-5 text-[#666666] hover:text-black" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-800 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#C8102E] hover:bg-[#B00020] disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Вход...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    <span>Войти в аккаунт</span>
                  </div>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-[#E0E0E0]">
              <div className="flex items-center justify-center gap-2 text-sm text-[#666666]">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Безопасный вход с шифрованием данных</span>
              </div>
            </div>
          </div>

          {/* Mobile Features */}
          <div className="lg:hidden mt-8 bg-white rounded-xl border border-[#E0E0E0] p-6">
            <h3 className="text-sm font-semibold text-black mb-4 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-[#C8102E]" />
              Что вы получите после входа:
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {features.slice(0, 4).map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-5 h-5 text-[#C8102E]" />
                    </div>
                    <p className="text-xs font-medium text-black">{feature.title}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#666666]">
              Нет аккаунта?{" "}
              <Link href="/auth/register" className="font-medium text-[#C8102E] hover:text-[#B00020]">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
