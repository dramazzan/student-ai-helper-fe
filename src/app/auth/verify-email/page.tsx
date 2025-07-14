"use client"
import { useEffect, useState } from "react"
import { verify } from "@/services/auth"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Brain,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Shield,
  Clock,
  AlertTriangle,
} from "lucide-react"

const VerifyPage = () => {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [countdown, setCountdown] = useState(3)
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get("token")
    const verifyUser = async () => {
      try {
        await verify(token)
        setStatus("success")

        // Countdown timer
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              router.push("/auth/login")
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      } catch (err: any) {
        setStatus("error")
        const message = err?.message || "Произошла ошибка подтверждения"
        setErrorMessage(message)
      }
    }

    if (token) {
      verifyUser()
    } else {
      setStatus("error")
      setErrorMessage("Токен не найден в ссылке")
    }
  }, [router, searchParams])

  const getStatusConfig = () => {
    switch (status) {
      case "loading":
        return {
          icon: Loader2,
          iconClass: "w-16 h-16 text-blue-600 animate-spin",
          bgClass: "from-blue-50 to-blue-100",
          borderClass: "border-blue-200",
          title: "Подтверждение email",
          subtitle: "Проверяем ваш токен...",
          description: "Пожалуйста, подождите, пока мы подтверждаем ваш email адрес.",
        }
      case "success":
        return {
          icon: CheckCircle,
          iconClass: "w-16 h-16 text-emerald-600",
          bgClass: "from-emerald-50 to-emerald-100",
          borderClass: "border-emerald-200",
          title: "Email успешно подтверждён!",
          subtitle: "Добро пожаловать в Student AI Helper",
          description: "Ваш аккаунт активирован. Теперь вы можете пользоваться всеми возможностями платформы.",
        }
      case "error":
        return {
          icon: XCircle,
          iconClass: "w-16 h-16 text-red-600",
          bgClass: "from-red-50 to-red-100",
          borderClass: "border-red-200",
          title: "Ошибка подтверждения",
          subtitle: "Не удалось подтвердить email",
          description: errorMessage,
        }
    }
  }

  const config = getStatusConfig()
  const StatusIcon = config.icon

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-yellow-800" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Student AI Helper</h1>
            <p className="text-slate-600 text-sm">Умный помощник студента</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className={`bg-gradient-to-r ${config.bgClass} border-b ${config.borderClass} p-8 text-center`}>
            <div className="flex justify-center mb-4">
              <div className={`p-4 bg-white rounded-full shadow-lg ${config.borderClass} border-2`}>
                <StatusIcon className={config.iconClass} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{config.title}</h2>
            <p className="text-slate-700 font-medium">{config.subtitle}</p>
          </div>

          <div className="p-8">
            <div className="text-center space-y-6">
              <p className="text-slate-600 leading-relaxed">{config.description}</p>

              {status === "loading" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-medium">Обработка запроса...</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }} />
                  </div>
                </div>
              )}

              {status === "success" && (
                <div className="space-y-6">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 text-emerald-700 mb-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Аккаунт активирован</span>
                    </div>
                    <p className="text-emerald-600 text-sm">
                      Теперь вы можете создавать тесты, отслеживать прогресс и получать персональные рекомендации.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
                      <ArrowRight className="w-5 h-5" />
                      <span className="font-medium">Автоматическое перенаправление</span>
                    </div>
                    <p className="text-blue-600 text-sm">
                      Перенаправляем на страницу входа через <span className="font-bold">{countdown}</span> секунд
                    </p>
                  </div>

                  <button
                    onClick={() => router.push("/auth/login")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ArrowRight className="w-5 h-5" />
                      <span>Перейти к входу сейчас</span>
                    </div>
                  </button>
                </div>
              )}

              {status === "error" && (
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 text-red-700 mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">Что могло пойти не так:</span>
                    </div>
                    <ul className="text-red-600 text-sm space-y-1 text-left">
                      <li>• Ссылка устарела (действительна 24 часа)</li>
                      <li>• Ссылка уже была использована</li>
                      <li>• Неверный формат токена</li>
                      <li>• Проблемы с сетевым соединением</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                      href="/auth/register"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Повторить регистрацию</span>
                    </Link>

                    <Link
                      href="/auth/login"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Войти в аккаунт</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <Mail className="w-4 h-4" />
              <span>Нужна помощь? Напишите в поддержку</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Не получили письмо?{" "}
            <button className="text-blue-600 hover:text-blue-700 font-medium">Отправить повторно</button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyPage
