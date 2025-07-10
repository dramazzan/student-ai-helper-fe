"use client"

import { useEffect, useState } from "react"
import { Download, ChevronDown, ChevronRight, FileText, HelpCircle, Loader2, AlertCircle, Layers } from "lucide-react"
import { fetchNormalTests, fetchMultiTests, getTestById, downloadTestDocx } from "@/services/testService"
import type { TestDownloadListProps } from "@/models/Test"

const TestDownloadList = () => {
  const [tests, setTests] = useState<TestDownloadListProps[]>([])
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)
  const [testContentMap, setTestContentMap] = useState<{ [key: string]: any }>({})
  const [loading, setLoading] = useState(false)
  const [contentLoading, setContentLoading] = useState<{ [key: string]: boolean }>({})
  const [downloadLoading, setDownloadLoading] = useState<{ [key: string]: boolean }>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTests = async () => {
      try {
        setLoading(true)
        setError(null)
        const [normalTests, multiTests] = await Promise.all([fetchNormalTests(), fetchMultiTests()])
        const all = [
          ...normalTests.map((t: any) => ({ ...t, type: "normal" })),
          ...multiTests.map((t: any) => ({ ...t, type: "multi" })),
        ]
        setTests(all)
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки тестов")
      } finally {
        setLoading(false)
      }
    }
    loadTests()
  }, [])

  const handleSelectTest = async (test: TestDownloadListProps) => {
    const isCurrentlySelected = selectedTestId === test._id
    setSelectedTestId(isCurrentlySelected ? null : test._id)

    if (!isCurrentlySelected && !testContentMap[test._id]) {
      setContentLoading((prev) => ({ ...prev, [test._id]: true }))
      try {
        const content = await getTestById(test._id)
        setTestContentMap((prev) => ({
          ...prev,
          [test._id]: content,
        }))
      } catch (err: any) {
        console.error("Ошибка при получении содержимого теста:", err)
      } finally {
        setContentLoading((prev) => ({ ...prev, [test._id]: false }))
      }
    }
  }

  const handleDownload = async (testId: string) => {
    setDownloadLoading((prev) => ({ ...prev, [testId]: true }))
    try {
      await downloadTestDocx(testId)
    } catch (err) {
      alert("Не удалось скачать файл")
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [testId]: false }))
    }
  }

  const getTestTypeConfig = (type: string) => {
    switch (type) {
      case "normal":
        return {
          label: "Обычный",
          color: "text-blue-700",
          bgColor: "bg-gradient-to-r from-blue-50 to-blue-100",
          borderColor: "border-blue-200",
          icon: FileText,
        }
      case "multi":
        return {
          label: "Мульти",
          color: "text-purple-700",
          bgColor: "bg-gradient-to-r from-purple-50 to-purple-100",
          borderColor: "border-purple-200",
          icon: Layers,
        }
      default:
        return {
          label: "Неизвестно",
          color: "text-gray-700",
          bgColor: "bg-gradient-to-r from-gray-50 to-gray-100",
          borderColor: "border-gray-200",
          icon: HelpCircle,
        }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl w-64 mx-auto animate-pulse" />
            <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-96 mx-auto animate-pulse" />
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 animate-pulse">
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-3/4" />
                    <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-1/3" />
                  </div>
                  <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-xl w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Ошибка загрузки</h3>
            <p className="text-gray-600 leading-relaxed">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (tests.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Нет тестов</h3>
          <p className="text-gray-600 text-lg">Тесты появятся здесь после создания</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Скачать тесты
            </h1>
            <p className="text-lg text-gray-600">Экспорт тестов в формате DOCX</p>
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full">
            <span className="text-sm font-medium text-blue-800">
              {tests.length} {tests.length === 1 ? "тест" : "тестов"}
            </span>
          </div>
        </div>

        {/* Tests */}
        <div className="space-y-6">
          {tests.map((test, index) => {
            const isSelected = selectedTestId === test._id
            const testContent = testContentMap[test._id]
            const isContentLoading = contentLoading[test._id]
            const isDownloadLoading = downloadLoading[test._id]
            const typeConfig = getTestTypeConfig(test.type)
            const TypeIcon = typeConfig.icon

            return (
              <div key={test._id} className="group">
                {/* Test Card */}
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden">
                  {/* Test Header */}
                  <div
                    className="flex items-center justify-between gap-6 p-8 cursor-pointer hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all duration-200"
                    onClick={() => handleSelectTest(test)}
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <div className="flex-shrink-0 transition-transform duration-300">
                        {isSelected ? (
                          <ChevronDown className="w-5 h-5 text-slate-500 transform rotate-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform duration-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-3">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors duration-200">
                          {test.title}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${typeConfig.color} ${typeConfig.bgColor} ${typeConfig.borderColor}`}
                          >
                            <TypeIcon className="w-4 h-4" />
                            {typeConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-emerald-400 disabled:to-emerald-500 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(test._id)
                      }}
                      disabled={isDownloadLoading}
                    >
                      {isDownloadLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span>{isDownloadLoading ? "Скачивание..." : "Скачать"}</span>
                    </button>
                  </div>

                  {/* Test Content */}
                  {isSelected && (
                    <div className="border-t border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                      <div className="p-8">
                        {isContentLoading ? (
                          <div className="space-y-6">
                            <div className="flex items-center gap-3 text-blue-600 mb-6">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span className="font-medium">Загрузка содержимого...</span>
                            </div>
                            <div className="space-y-4">
                              {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4 mb-4" />
                                  <div className="ml-6 space-y-2">
                                    <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2" />
                                    <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-2/3" />
                                    <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/3" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : testContent?.questions ? (
                          <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                <HelpCircle className="w-5 h-5 text-blue-600" />
                              </div>
                              <h4 className="text-lg font-bold text-gray-900">Содержание теста</h4>
                              <div className="ml-auto px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full">
                                <span className="text-sm font-medium text-blue-800">
                                  {testContent.questions.length}{" "}
                                  {testContent.questions.length === 1 ? "вопрос" : "вопросов"}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-4">
                              {testContent.questions.map((q: any, i: number) => (
                                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-400">
                                  <div className="flex items-start gap-4 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                      {i + 1}
                                    </div>
                                    <p className="text-gray-900 leading-relaxed font-medium">{q.question}</p>
                                  </div>
                                  {q.options && q.options.length > 0 && (
                                    <div className="ml-12 space-y-2">
                                      {q.options.map((opt: string, j: number) => (
                                        <div key={j} className="flex items-center gap-3 text-sm text-gray-600">
                                          <div className="w-2 h-2 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full flex-shrink-0" />
                                          <span className="leading-relaxed">{opt}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                              <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <p className="text-gray-600 font-medium">Не удалось загрузить содержимое</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TestDownloadList
