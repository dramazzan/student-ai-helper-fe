"use client"

import { useEffect, useState } from "react"
import {
  Download,
  ChevronDown,
  ChevronRight,
  FileText,
  HelpCircle,
  Loader2,
  Layers,
  File,
  FileEdit,
} from "lucide-react"
import { fetchNormalTests, fetchMultiTests, getTestById } from "@/services/testService/fetchService"
import { downloadTestFile } from "@/services/testService/downloadService"
import type { TestDownloadListProps } from "@/models/Test"

const TestDownloadList = () => {
  const [tests, setTests] = useState<TestDownloadListProps[]>([])
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)
  const [testContentMap, setTestContentMap] = useState<{ [key: string]: any }>({})
  const [loading, setLoading] = useState(false)
  const [contentLoading, setContentLoading] = useState<{
    [key: string]: boolean
  }>({})
  const [downloadLoading, setDownloadLoading] = useState<{
    [key: string]: boolean
  }>({})
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
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

  const handleDownload = async (testId: string, format: "pdf" | "docx" | "gift" | "qti" | "moodlexml" | "csv") => {
    setDownloadLoading((prev) => ({ ...prev, [testId]: true }))
    try {
      await downloadTestFile(testId, format)
    } catch (err) {
      alert("Не удалось скачать файл")
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [testId]: false }))
      setOpenDropdownId(null)
    }
  }

  const getTestTypeConfig = (type: string) => {
    switch (type) {
      case "normal":
        return {
          label: "Обычный",
          color: "text-[#C8102E]",
          bgColor: "bg-gradient-to-r from-red-50 to-red-100",
          borderColor: "border-red-200",
          icon: FileText,
        }
      case "multi":
        return {
          label: "Мульти",
          color: "text-[#B00020]",
          bgColor: "bg-gradient-to-r from-red-50 to-red-100",
          borderColor: "border-red-200",
          icon: Layers,
        }
      default:
        return {
          label: "Неизвестно",
          color: "text-[#666666]",
          bgColor: "bg-gradient-to-r from-gray-50 to-gray-100",
          borderColor: "border-[#E0E0E0]",
          icon: HelpCircle,
        }
    }
  }

  // Закрытие выпадающего меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId) {
        const target = event.target as HTMLElement
        if (!target.closest(".dropdown-container")) {
          console.log("Закрываем выпадающее меню")
          setOpenDropdownId(null)
        }
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [openDropdownId])

  // Отладочная информация
  console.log("Открытое выпадающее меню:", openDropdownId)
  console.log("Количество тестов:", tests.length)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto animate-pulse" />
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-[#E0E0E0] p-8 animate-pulse">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-5 h-5 bg-gray-200 rounded" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-8 bg-gray-200 rounded w-24" />
                    </div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded-xl w-32" />
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-[#E0E0E0] p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-3">Ошибка загрузки</h3>
            <p className="text-[#666666] mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#C8102E] hover:bg-[#B00020] text-white font-semibold rounded-lg transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-black via-[#C8102E] to-black bg-clip-text text-transparent">
            Скачать тесты
          </h1>
          <p className="text-lg text-[#666666]">Экспорт тестов в разных форматах</p>
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-full">
            <span className="text-sm font-medium text-[#C8102E]">
              {tests.length} {tests.length === 1 ? "тест" : "тестов"}
            </span>
          </div>
        </div>

        {tests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-[#E0E0E0] p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-[#666666]" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-3">Нет тестов для скачивания</h3>
            <p className="text-[#666666]">Создайте тесты, чтобы они появились здесь</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tests.map((test) => {
              const isSelected = selectedTestId === test._id
              const testContent = testContentMap[test._id]
              const isContentLoading = contentLoading[test._id]
              const isDownloadLoading = downloadLoading[test._id]
              const typeConfig = getTestTypeConfig(test.type)
              const TypeIcon = typeConfig.icon

              return (
                <div key={test._id} className="group relative">
                  <div className="bg-white rounded-2xl shadow-lg border border-[#E0E0E0] overflow-visible hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between gap-6 p-8">
                      {/* Левая часть - кликабельная для раскрытия содержимого */}
                      <div
                        className="flex items-center gap-6 flex-1 cursor-pointer hover:bg-gray-50/50 rounded-xl p-2 -m-2 transition-colors"
                        onClick={() => handleSelectTest(test)}
                      >
                        <div className="flex-shrink-0">
                          {isSelected ? (
                            <ChevronDown className="w-5 h-5 text-[#666666]" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-[#666666]" />
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <h3 className="text-xl font-bold text-black group-hover:text-[#C8102E] transition-colors">
                            {test.title}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${typeConfig.color} ${typeConfig.bgColor} ${typeConfig.borderColor}`}
                          >
                            <TypeIcon className="w-4 h-4" />
                            {typeConfig.label}
                          </span>
                        </div>
                      </div>

                      <div className="relative dropdown-container">
                        <button
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C8102E] to-[#B00020] hover:from-[#B00020] hover:to-[#C8102E] text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log("Кнопка скачать нажата для теста:", test._id)
                            setOpenDropdownId((prev) => (prev === test._id ? null : test._id))
                          }}
                          disabled={isDownloadLoading}
                        >
                          {isDownloadLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          <span>Скачать</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              openDropdownId === test._id ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Выпадающее меню с улучшенным позиционированием */}
                        {openDropdownId === test._id && (
                          <div
                            className="absolute right-0 mt-2 w-56 bg-white border border-[#E0E0E0] rounded-xl shadow-2xl z-[9999] overflow-hidden"
                            style={{
                              position: "absolute",
                              top: "100%",
                              right: 0,
                              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                              zIndex: 9999,
                            }}
                          >
                            <button
                              className="block w-full text-left px-4 py-3 text-sm text-black hover:bg-red-50 transition-colors duration-150 font-medium border-b border-[#E0E0E0]"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                console.log("Скачать DOCX для теста:", test._id)
                                handleDownload(test._id, "docx")
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <FileEdit className="w-4 h-4 text-[#C8102E]" />
                                <span>Скачать как DOCX</span>
                              </div>
                            </button>

                            <button
                              className="block w-full text-left px-4 py-3 text-sm text-black hover:bg-red-50 transition-colors duration-150 font-medium border-b border-[#E0E0E0]"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                console.log("Скачать PDF для теста:", test._id)
                                handleDownload(test._id, "pdf")
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <File className="w-4 h-4 text-[#B00020]" />
                                <span>Скачать как PDF</span>
                              </div>
                            </button>

                            <button
                              className="block w-full text-left px-4 py-3 text-sm text-black hover:bg-red-50 font-medium border-b border-[#E0E0E0]"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDownload(test._id, "gift")
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <File className="w-4 h-4 text-emerald-600" />
                                <span>Скачать как GIFT</span>
                              </div>
                            </button>

                            <button
                              className="block w-full text-left px-4 py-3 text-sm text-black hover:bg-red-50 font-medium border-b border-[#E0E0E0]"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDownload(test._id, "qti")
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <File className="w-4 h-4 text-cyan-600" />
                                <span>Скачать как QTI</span>
                              </div>
                            </button>

                            <button
                              className="block w-full text-left px-4 py-3 text-sm text-black hover:bg-red-50 font-medium border-b border-[#E0E0E0]"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDownload(test._id, "moodlexml")
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <File className="w-4 h-4 text-amber-600" />
                                <span>Скачать как Moodle XML</span>
                              </div>
                            </button>

                            <button
                              className="block w-full text-left px-4 py-3 text-sm text-black hover:bg-red-50 font-medium"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDownload(test._id, "csv")
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <File className="w-4 h-4 text-purple-600" />
                                <span>Скачать как CSV</span>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="border-t border-[#E0E0E0] bg-gradient-to-br from-gray-50 to-white">
                        <div className="p-8">
                          {isContentLoading ? (
                            <div className="text-[#C8102E] flex items-center gap-3">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Загрузка содержимого...</span>
                            </div>
                          ) : testContent?.questions ? (
                            <div className="space-y-6">
                              {testContent.questions.map((q: any, i: number) => (
                                <div
                                  key={i}
                                  className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#C8102E] hover:shadow-md transition-shadow"
                                >
                                  <div className="flex items-start gap-4 mb-4">
                                    <div className="w-8 h-8 bg-[#C8102E] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                      {i + 1}
                                    </div>
                                    <p className="text-black font-medium">{q.question}</p>
                                  </div>
                                  {q.options && (
                                    <div className="ml-12 space-y-2">
                                      {q.options.map((opt: string, j: number) => (
                                        <div key={j} className="flex items-center gap-3 text-sm text-[#666666]">
                                          <div className="w-2 h-2 bg-[#666666] rounded-full" />
                                          <span>{opt}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HelpCircle className="w-6 h-6 text-[#666666]" />
                              </div>
                              <p className="text-[#666666]">Нет содержимого для отображения</p>
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
        )}
      </div>
    </div>
  )
}

export default TestDownloadList
