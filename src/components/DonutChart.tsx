"use client"

import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { useEffect, useState } from "react"
import { BookOpen, TrendingUp } from "lucide-react"

ChartJS.register(ArcElement, Tooltip, Legend)

interface DonutChartProps {
  average: number
  testsTaken: number
  isLoading?: boolean
}

const DonutChart = ({ average, testsTaken, isLoading = false }: DonutChartProps) => {
  const [animatedAverage, setAnimatedAverage] = useState(0)
  const [animatedTests, setAnimatedTests] = useState(0)

  useEffect(() => {
    if (isLoading) return

    const duration = 1000
    const steps = 50
    const stepDuration = duration / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      setAnimatedAverage(Math.round(average * progress))
      setAnimatedTests(Math.round(testsTaken * progress))

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedAverage(average)
        setAnimatedTests(testsTaken)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [average, testsTaken, isLoading])

  const getColor = (score: number) => {
    if (score >= 80) return "#10b981" // Зеленый для отличных результатов
    if (score >= 60) return "#f59e0b" // Желтый для хороших результатов
    if (score >= 40) return "#f97316" // Оранжевый для средних результатов
    return "#ef4444" // Красный для плохих результатов
  }

  const getTextColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-amber-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200"
    if (score >= 60) return "bg-amber-50 border-amber-200"
    if (score >= 40) return "bg-orange-50 border-orange-200"
    return "bg-red-50 border-red-200"
  }

  const data = {
    labels: ["Средний балл", "Остальное"],
    datasets: [
      {
        data: [animatedAverage, 100 - animatedAverage],
        backgroundColor: [getColor(animatedAverage), "#E0E0E0"],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            if (context.dataIndex === 0) {
              return `Средний балл: ${context.parsed}%`
            }
            return `До максимума: ${context.parsed}%`
          },
        },
      },
    },
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="w-48 h-48 bg-gray-200 rounded-full animate-pulse" />
        <div className="space-y-2 text-center">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className={`relative p-6 rounded-2xl border-2 ${getBgColor(animatedAverage)} shadow-lg`}>
        <div className="relative w-48 h-48">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getTextColor(animatedAverage)}`}>{animatedAverage}%</div>
              <div className="text-sm text-[#666666]">средний балл</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <div className={`rounded-xl p-4 border-2 ${getBgColor(animatedAverage)}`}>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className={`w-4 h-4 ${getTextColor(animatedAverage)}`} />
            <span className="text-xs font-medium text-[#666666]">Тестов</span>
          </div>
          <div className={`text-xl font-bold ${getTextColor(animatedAverage)}`}>{animatedTests}</div>
        </div>

        <div className={`rounded-xl p-4 border-2 ${getBgColor(animatedAverage)}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-4 h-4 ${getTextColor(animatedAverage)}`} />
            <span className="text-xs font-medium text-[#666666]">Прогресс</span>
          </div>
          <div className={`text-sm font-medium ${getTextColor(animatedAverage)}`}>
            {animatedAverage >= 80
              ? "Отлично!"
              : animatedAverage >= 60
                ? "Хорошо"
                : animatedAverage >= 40
                  ? "Неплохо"
                  : "Нужно больше"}
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <div className="flex justify-between text-xs text-[#666666] mb-2">
          <span>До отличного результата</span>
          <span>{Math.min(animatedAverage, 80)}/80</span>
        </div>
        <div className="w-full bg-[#E0E0E0] rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${Math.min((animatedAverage / 80) * 100, 100)}%`,
              backgroundColor: getColor(animatedAverage),
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default DonutChart
