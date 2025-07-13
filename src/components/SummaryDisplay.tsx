"use client"
import { useState } from "react"
import {
  Globe,
  Cloud,
  Droplets,
  Thermometer,
  Microscope,
  Sun,
  Zap,
  CircuitBoard,
  BookOpen,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Brain,
} from "lucide-react"

interface SummarySection {
  id: string
  title: string
  content: string
  icon: any
  color: string
}

interface SummaryDisplayProps {
  summary: string
}

const SummaryDisplay = ({ summary }: SummaryDisplayProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  // Парсинг конспекта
  const parseSummary = (text: string): SummarySection[] => {
    const sections: SummarySection[] = []
    const lines = text.split("\n").filter((line) => line.trim())

    const iconMap: { [key: string]: { icon: any; color: string } } = {
      земля: { icon: Globe, color: "from-emerald-500 to-emerald-600" },
      атмосфера: { icon: Cloud, color: "from-sky-500 to-sky-600" },
      вода: { icon: Droplets, color: "from-blue-500 to-blue-600" },
      климат: { icon: Thermometer, color: "from-orange-500 to-orange-600" },
      клетка: { icon: Microscope, color: "from-purple-500 to-purple-600" },
      солнечная: { icon: Sun, color: "from-yellow-500 to-yellow-600" },
      законы: { icon: Zap, color: "from-red-500 to-red-600" },
      электрические: { icon: CircuitBoard, color: "from-indigo-500 to-indigo-600" },
    }

    let currentSection: SummarySection | null = null

    lines.forEach((line) => {
      const match = line.match(/\*\*(\d+)\.\s*([^:]+):\*\*\s*(.+)/)
      if (match) {
        const [, number, title, content] = match
        const key = title.toLowerCase()
        const iconData = Object.entries(iconMap).find(([k]) => key.includes(k))

        currentSection = {
          id: `section-${number}`,
          title: title.trim(),
          content: content.trim(),
          icon: iconData ? iconData[1].icon : BookOpen,
          color: iconData ? iconData[1].color : "from-slate-500 to-slate-600",
        }
        sections.push(currentSection)
      } else if (currentSection && line.trim() && !line.startsWith("##")) {
        currentSection.content += " " + line.trim()
      }
    })

    return sections
  }

  const sections = parseSummary(summary)

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Ошибка копирования:", err)
    }
  }

  const expandAll = () => {
    setExpandedSections(new Set(sections.map((s) => s.id)))
  }

  const collapseAll = () => {
    setExpandedSections(new Set())
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Краткий конспект</h1>
                <p className="text-blue-100">Естественные науки</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sm text-blue-100">ИИ-генерация</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={expandAll}
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded-lg transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
              Развернуть все
            </button>
            <button
              onClick={collapseAll}
              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
              Свернуть все
            </button>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm font-medium rounded-lg transition-colors ml-auto"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Скопировано!" : "Копировать"}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-slate-900">{sections.length}</div>
              <div className="text-sm text-slate-600">Разделов</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-slate-900">{summary.split(" ").length}</div>
              <div className="text-sm text-slate-600">Слов</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-slate-900">{Math.ceil(summary.split(" ").length / 200)}</div>
              <div className="text-sm text-slate-600">Мин чтения</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-slate-900">{expandedSections.size}</div>
              <div className="text-sm text-slate-600">Открыто</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => {
          const Icon = section.icon
          const isExpanded = expandedSections.has(section.id)

          return (
            <div
              key={section.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-4 cursor-pointer select-none" onClick={() => toggleSection(section.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {index + 1}. {section.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {isExpanded ? "Нажмите, чтобы свернуть" : "Нажмите, чтобы развернуть"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {section.content.split(" ").length} слов
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-slate-400 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400 transition-transform duration-200" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50">
                  <div className="p-6">
                    <div className="prose prose-slate max-w-none">
                      <div className="text-slate-700 leading-relaxed">
                        {section.content.split(".").map((sentence, idx) => {
                          if (!sentence.trim()) return null
                          return (
                            <p key={idx} className="mb-3 last:mb-0">
                              {sentence.trim()}.
                            </p>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">💡 Конспект готов к изучению!</h3>
          <p className="text-slate-600 text-sm">
            Используйте этот материал для подготовки к экзаменам и закрепления знаний. Каждый раздел содержит ключевую
            информацию по теме.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SummaryDisplay
