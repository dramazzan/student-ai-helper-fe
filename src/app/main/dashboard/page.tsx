"use client"
import { useEffect, useState } from "react"
import { getUserData, getOverallStats, getUserProgress } from "@/services/data"
import type { User } from "@/models/User"
import DonutChart from "@/components/DonutChart"
import ProgressOverview from "@/components/ProgressOverview"
import {
  UserIcon,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Target,
  Sparkles,
  Crown,
} from "lucide-react"

const DashboardPage = () => {
  const [currentUser, setCurrentUser] = useState<User>({
    _id: "",
    name: "",
    email: "",
    role: "student",
    summaries: [],
    tests: [],
    isVerified: true,
  })
  const [averageScore, setAverageScore] = useState<number>(0)
  const [testsTaken, setTestsTaken] = useState<number>(0)
  const [userProgress, setUserProgress] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response1 = await getUserData()
        if (response1) setCurrentUser(response1)

        const response2 = await getOverallStats()
        if (response2) {
          setAverageScore(response2.average || 0)
          setTestsTaken(response2.testsTaken || 0)
        }

        const response3 = await getUserProgress()
        if (response3) {
          console.log("User progress data:", response3)
          setUserProgress(response3)
        }
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAll()
  }, [])

  const getRoleConfig = (role: string) => {
    switch (role) {
      case "admin":
        return {
          color: "text-purple-700 bg-purple-100 border-purple-200",
          icon: Crown,
          label: "Администратор",
        }
      case "teacher":
        return {
          color: "text-blue-700 bg-blue-100 border-blue-200",
          icon: BookOpen,
          label: "Преподаватель",
        }
      default:
        return {
          color: "text-emerald-700 bg-emerald-100 border-emerald-200",
          icon: UserIcon,
          label: "Студент",
        }
    }
  }

  const roleConfig = getRoleConfig(currentUser.role)
  const RoleIcon = roleConfig.icon

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-200 rounded-full animate-pulse" />
            <div className="space-y-3 flex-1">
              <div className="h-8 bg-slate-200 rounded w-64 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-20" />
                  <div className="h-6 bg-slate-200 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-yellow-800" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Добро пожаловать, {currentUser.name}!</h1>
                <p className="text-blue-100">Ваш персональный дашборд обучения</p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <div className="text-2xl font-bold">{new Date().toLocaleDateString("ru-RU")}</div>
                <div className="text-blue-200 text-sm">Сегодня</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Информация профиля</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Name */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <UserIcon className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-600">Имя</span>
              </div>
              <div className="text-lg font-semibold text-slate-900">{currentUser.name}</div>
            </div>

            {/* Email */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-600">Email</span>
              </div>
              <div className="text-sm font-medium text-slate-900 truncate">{currentUser.email}</div>
            </div>

            {/* Role */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-600">Роль</span>
              </div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-sm font-medium ${roleConfig.color}`}
              >
                <RoleIcon className="w-4 h-4" />
                {roleConfig.label}
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                {currentUser.isVerified ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                )}
                <span className="text-sm font-medium text-slate-600">Статус</span>
              </div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-sm font-medium ${
                  currentUser.isVerified
                    ? "text-emerald-700 bg-emerald-100 border-emerald-200"
                    : "text-amber-700 bg-amber-100 border-amber-200"
                }`}
              >
                {currentUser.isVerified ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Подтверждён
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Не подтверждён
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Charts Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Результаты тестирования</h2>
          </div>
          <p className="text-slate-600 mt-2">Общая статистика на основе ваших сданных тестов</p>
        </div>

        <div className="p-6">
          <div className="flex justify-center">
            <DonutChart average={averageScore} testsTaken={testsTaken} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <ProgressOverview data={userProgress} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default DashboardPage
