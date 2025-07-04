"use client"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions, type ChartData, type Plugin } from "chart.js"
import { useEffect, useState, useRef } from "react"
import { TrendingUp, Award, Target, BookOpen } from "lucide-react"

ChartJS.register(ArcElement, Tooltip, Legend)

interface DonutChartProps {
  average: number
  testsTaken: number
  isLoading?: boolean
  showAnimation?: boolean
  size?: "sm" | "md" | "lg"
}

const DonutChart = ({ average, testsTaken, isLoading = false, showAnimation = true, size = "md" }: DonutChartProps) => {
  const [animatedAverage, setAnimatedAverage] = useState(0)
  const [animatedTests, setAnimatedTests] = useState(0)
  const chartRef = useRef<ChartJS<"doughnut"> | null>(null)

  // Размеры в зависимости от пропа size
  const sizeConfig = {
    sm: { width: 180, height: 180, fontSize: "text-lg", iconSize: "w-5 h-5" },
    md: { width: 240, height: 240, fontSize: "text-xl", iconSize: "w-6 h-6" },
    lg: { width: 300, height: 300, fontSize: "text-2xl", iconSize: "w-7 h-7" },
  }

  const config = sizeConfig[size]

  // Анимация значений
  useEffect(() => {
    if (!showAnimation || isLoading) return

    const duration = 1500
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      // Easing function для плавности
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
      const easedProgress = easeOutCubic(progress)

      setAnimatedAverage(Math.round(average * easedProgress))
      setAnimatedTests(Math.round(testsTaken * easedProgress))

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedAverage(average)
        setAnimatedTests(testsTaken)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [average, testsTaken, showAnimation, isLoading])

  // Цветовая схема в зависимости от результата
  const getColorScheme = (score: number) => {
    if (score >= 80) {
      return {
        primary: ["#10b981", "#059669"], // emerald gradient
        secondary: "#f0fdf4",
        text: "text-emerald-700",
        bg: "from-emerald-50 to-emerald-100",
        border: "border-emerald-200",
        icon: "text-emerald-600",
      }
    } else if (score >= 60) {
      return {
        primary: ["#f59e0b", "#d97706"], // amber gradient
        secondary: "#fffbeb",
        text: "text-amber-700",
        bg: "from-amber-50 to-amber-100",
        border: "border-amber-200",
        icon: "text-amber-600",
      }
    } else if (score >= 40) {
      return {
        primary: ["#f97316", "#ea580c"], // orange gradient
        secondary: "#fff7ed",
        text: "text-orange-700",
        bg: "from-orange-50 to-orange-100",
        border: "border-orange-200",
        icon: "text-orange-600",
      }
    } else {
      return {
        primary: ["#ef4444", "#dc2626"], // red gradient
        secondary: "#fef2f2",
        text: "text-red-700",
        bg: "from-red-50 to-red-100",
        border: "border-red-200",
        icon: "text-red-600",
      }
    }
  }

  const colorScheme = getColorScheme(animatedAverage)

  // Создание градиента для Chart.js
  const createGradient = (ctx: CanvasRenderingContext2D, colors: string[]) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, colors[0])
    gradient.addColorStop(1, colors[1])
    return gradient
  }

  // Кастомный плагин для центрального текста
  const centerTextPlugin: Plugin<"doughnut"> = {
    id: "centerText",
    beforeDraw: (chart) => {
      if (!chart.canvas) return

      const { ctx, width, height } = chart
      const centerX = width / 2
      const centerY = height / 2

      ctx.save()
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Основной текст
      ctx.fillStyle = colorScheme.text.replace("text-", "#")
      ctx.font = `bold ${size === "lg" ? "24" : size === "md" ? "20" : "16"}px Inter, sans-serif`
      ctx.fillText(`${animatedAverage}%`, centerX, centerY - 10)

      // Подпись
      ctx.fillStyle = "#64748b"
      ctx.font = `500 ${size === "lg" ? "14" : size === "md" ? "12" : "10"}px Inter, sans-serif`
      ctx.fillText("средний балл", centerX, centerY + 15)

      ctx.restore()
    },
  }

  const data: ChartData<"doughnut"> = {
    labels: ["Средний балл", "Остальное"],
    datasets: [
      {
        data: [animatedAverage, 100 - animatedAverage],
        backgroundColor: (context) => {
          const chart = context.chart
          const { ctx } = chart

          if (context.dataIndex === 0) {
            return createGradient(ctx, colorScheme.primary)
          }
          return "#e2e8f0"
        },
        borderWidth: 0,
        borderRadius: 8,
        spacing: 2,
      },
    ],
  }

  const options: ChartOptions<"doughnut"> = {
    cutout: "75%",
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: showAnimation,
      duration: showAnimation ? 1500 : 0,
      easing: "easeOutCubic",
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: colorScheme.primary[0],
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: () => "",
          label: (context) => {
            if (context.dataIndex === 0) {
              return `Средний балл: ${context.parsed}%`
            }
            return `До максимума: ${context.parsed}%`
          },
        },
      },
    },
    onHover: (event, elements) => {
      if (event.native?.target) {
        const target = event.native.target as HTMLElement
        target.style.cursor = elements.length > 0 ? "pointer" : "default"
      }
    },
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div
          className="animate-pulse bg-slate-200 rounded-full"
          style={{ width: config.width, height: config.height }}
        />
        <div className="space-y-2 text-center">
          <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
          <div className="h-3 bg-slate-200 rounded w-32 animate-pulse" />
        </div>
      </div>
    )
  }

  const getPerformanceIcon = () => {
    if (animatedAverage >= 80) return <Award className={`${config.iconSize} ${colorScheme.icon}`} />
    if (animatedAverage >= 60) return <Target className={`${config.iconSize} ${colorScheme.icon}`} />
    return <TrendingUp className={`${config.iconSize} ${colorScheme.icon}`} />
  }

  const getPerformanceText = () => {
    if (animatedAverage >= 80) return "Отличный результат!"
    if (animatedAverage >= 60) return "Хороший прогресс"
    if (animatedAverage >= 40) return "Есть над чем работать"
    return "Нужно больше практики"
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Chart Container */}
      <div className="relative group">
        <div
          className={`relative bg-gradient-to-br ${colorScheme.bg} rounded-full p-6 border-2 ${colorScheme.border} shadow-lg group-hover:shadow-xl transition-all duration-300`}
          style={{ width: config.width + 48, height: config.height + 48 }}
        >
          <div className="relative" style={{ width: config.width, height: config.height }}>
            <Doughnut ref={chartRef} data={data} options={options} plugins={[centerTextPlugin]} />
          </div>

          {/* Glow effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${colorScheme.bg} rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <div className={`bg-gradient-to-br ${colorScheme.bg} rounded-xl p-4 border ${colorScheme.border}`}>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className={`w-4 h-4 ${colorScheme.icon}`} />
            <span className="text-xs font-medium text-slate-600">Тестов пройдено</span>
          </div>
          <div className={`text-2xl font-bold ${colorScheme.text}`}>{animatedTests}</div>
        </div>

        <div className={`bg-gradient-to-br ${colorScheme.bg} rounded-xl p-4 border ${colorScheme.border}`}>
          <div className="flex items-center gap-2 mb-2">
            {getPerformanceIcon()}
            <span className="text-xs font-medium text-slate-600">Оценка</span>
          </div>
          <div className={`text-sm font-medium ${colorScheme.text}`}>{getPerformanceText()}</div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="w-full max-w-sm">
        <div className="flex justify-between text-xs text-slate-600 mb-2">
          <span>Прогресс к отличному результату</span>
          <span>{Math.min(animatedAverage, 80)}/80</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className={`bg-gradient-to-r ${colorScheme.primary[0]} to-${colorScheme.primary[1]} h-2 rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${Math.min((animatedAverage / 80) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default DonutChart
