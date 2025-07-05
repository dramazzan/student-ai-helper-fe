"use client"
import { useEffect, useState } from "react"
import { Download, ChevronDown, ChevronRight, FileText, HelpCircle, Loader2, AlertCircle, Layers } from "lucide-react"
import { fetchNormalTests, fetchMultiTests, getTestById, downloadTestDocx } from "@/services/testService"
import { TestDownloadListProps } from "@/models/Test"

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
          color: "text-blue-700 bg-blue-100 border-blue-200",
          icon: FileText,
        }
      case "multi":
        return {
          label: "Мульти",
          color: "text-purple-700 bg-purple-100 border-purple-200",
          icon: Layers,
        }
      default:
        return {
          label: "Неизвестно",
          color: "text-slate-700 bg-slate-100 border-slate-200",
          icon: HelpCircle,
        }
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-8 bg-slate-200 rounded w-48 animate-pulse" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/4" />
              </div>
              <div className="h-10 bg-slate-200 rounded-lg w-24" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Ошибка загрузки</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  if (tests.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Нет доступных тестов</h3>
          <p className="text-slate-500">Тесты появятся здесь, когда они будут добавлены</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Download className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">Список тестов</h2>
        <div className="ml-auto text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {tests.length} {tests.length === 1 ? "тест" : "тестов"}
        </div>
      </div>

      <div className="space-y-4">
        {tests.map((test) => {
          const isSelected = selectedTestId === test._id
          const testContent = testContentMap[test._id]
          const isContentLoading = contentLoading[test._id]
          const isDownloadLoading = downloadLoading[test._id]
          const typeConfig = getTestTypeConfig(test.type)
          const TypeIcon = typeConfig.icon

          return (
            <div
              key={test._id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                isSelected
                  ? "border-indigo-300 shadow-lg shadow-indigo-100"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="flex items-center gap-4 flex-1 cursor-pointer select-none"
                    onClick={() => handleSelectTest(test)}
                  >
                    <div className="flex-shrink-0">
                      {isSelected ? (
                        <ChevronDown className="w-5 h-5 text-slate-400 transition-transform duration-200" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400 transition-transform duration-200" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 break-words">{test.title}</h3>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-sm font-medium ${typeConfig.color}`}
                      >
                        <TypeIcon className="w-4 h-4" />
                        <span>{typeConfig.label}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed"
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
              </div>

              {isSelected && (
                <div className="border-t border-slate-100 bg-slate-50/50">
                  <div className="p-6">
                    {isContentLoading ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600 mb-4">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Загрузка содержимого теста...</span>
                        </div>
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                            <div className="space-y-3">
                              <div className="h-5 bg-slate-200 rounded w-3/4" />
                              <div className="space-y-2 ml-4">
                                <div className="h-4 bg-slate-200 rounded w-1/2" />
                                <div className="h-4 bg-slate-200 rounded w-2/3" />
                                <div className="h-4 bg-slate-200 rounded w-1/3" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : testContent?.questions ? (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                          <HelpCircle className="w-5 h-5 text-indigo-600" />
                          <h3 className="text-lg font-semibold text-slate-900">Содержание теста</h3>
                          <div className="ml-auto text-sm text-slate-500 bg-white px-3 py-1 rounded-full border">
                            {testContent.questions.length} {testContent.questions.length === 1 ? "вопрос" : "вопросов"}
                          </div>
                        </div>

                        <div className="space-y-4">
                          {testContent.questions.map((q: any, i: number) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
                              <div className="flex items-start gap-3 mb-4">
                                <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                  {i + 1}
                                </div>
                                <p className="font-medium text-slate-900 leading-relaxed">{q.question}</p>
                              </div>

                              {q.options && q.options.length > 0 && (
                                <div className="ml-9 space-y-2">
                                  {q.options.map((opt: string, j: number) => (
                                    <div key={j} className="flex items-center gap-3 text-sm text-slate-700">
                                      <div className="w-2 h-2 bg-slate-300 rounded-full flex-shrink-0" />
                                      <span>{opt}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">Не удалось загрузить содержимое теста</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TestDownloadList
