"use client"

import type { RegisterDto } from "@/models/User"
import { register } from "@/services/auth"
import { type ChangeEvent, type FormEvent, useState } from "react"
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
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
  Check,
} from "lucide-react"
import Link from "next/link"

const RegisterPage = () => {
  const [registerData, setRegisterData] = useState<RegisterDto>({
    name: "",
    email: "",
    password: "",
  })
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (registerData.password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    if (registerData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      return
    }

    setLoading(true)
    try {
      const res = await register(registerData)
      setSuccess(res.message || "Письмо подтверждения отправлено!")
    } catch (err: any) {
      setError(err?.message || "Произошла ошибка при регистрации")
    } finally {
      setLoading(false)
    }
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

  const benefits = [
    "Неограниченное создание тестов",
    "Детальная аналитика прогресса",
    "Персональные рекомендации",
    "Система достижений и наград",
    "Безопасное хранение данных",
    "Техническая поддержка 24/7",
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
              <h2 className="text-3xl font-bold text-black mb-4">Присоединяйтесь к тысячам студентов</h2>
              <p className="text-[#666666] text-lg leading-relaxed">
                Создайте аккаунт и получите доступ к мощным инструментам для эффективного обучения и подготовки к
                экзаменам.
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
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-[#666666]" />
                <h3 className="font-semibold text-black">Что вы получите бесплатно:</h3>
              </div>
              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-[#666666] text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
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

          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#E0E0E0] p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">Создать аккаунт</h2>
              <p className="text-[#666666]">Присоединяйтесь к сообществу студентов</p>
            </div>

            {success ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">Регистрация успешна!</h3>
                  <p className="text-[#666666] text-sm">{success}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-emerald-800 text-sm">
                    Проверьте свою почту и перейдите по ссылке для подтверждения аккаунта.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-black">
                    Полное имя
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#666666]" />
                    <input
                      type="text"
                      name="name"
                      id="name"
                      onChange={handleChange}
                      value={registerData.name}
                      placeholder="Иван Иванов"
                      className="w-full pl-10 pr-4 py-3 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E] text-black placeholder-[#666666]"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

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
                      value={registerData.email}
                      placeholder="student@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E] text-black placeholder-[#666666]"
                      required
                      disabled={loading}
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
                      value={registerData.password}
                      placeholder="Минимум 6 символов"
                      className="w-full pl-10 pr-12 py-3 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E] text-black placeholder-[#666666]"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-[#666666] hover:text-black" />
                      ) : (
                        <Eye className="h-5 w-5 text-[#666666] hover:text-black" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
                    Подтвердите пароль
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#666666]" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                      placeholder="Повторите пароль"
                      className="w-full pl-10 pr-12 py-3 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-[#C8102E] text-black placeholder-[#666666]"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
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
                  disabled={loading}
                  className="w-full bg-[#C8102E] hover:bg-[#B00020] disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Создание аккаунта...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      <span>Создать аккаунт</span>
                    </div>
                  )}
                </button>

                {/* Terms and Privacy */}
                <div className="text-center">
                  <p className="text-xs text-[#666666]">
                    Создавая аккаунт, вы соглашаетесь с{" "}
                    <button className="text-[#C8102E] hover:text-[#B00020]">Условиями использования</button> и{" "}
                    <button className="text-[#C8102E] hover:text-[#B00020]">Политикой конфиденциальности</button>
                  </p>
                </div>
              </form>
            )}

            {/* Security Notice */}
            {!success && (
              <div className="mt-6 pt-6 border-t border-[#E0E0E0]">
                <div className="flex items-center justify-center gap-2 text-sm text-[#666666]">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>Ваши данные защищены SSL шифрованием</span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Features */}
          <div className="lg:hidden mt-8 bg-white rounded-xl border border-[#E0E0E0] p-6">
            <h3 className="text-sm font-semibold text-black mb-4 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-[#C8102E]" />
              Что вы получите бесплатно:
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => {
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

          {/* Login Link */}
          {!success && (
            <div className="mt-6 text-center">
              <p className="text-sm text-[#666666]">
                Уже есть аккаунт?{" "}
                <Link href="/auth/login" className="text-[#C8102E] hover:text-[#B00020] font-medium">
                  Войти
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
