"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import {
  fetchNormalTests,
  fetchMultiTests,
  getTestById,
} from "@/services/testService/fetchService";
import { downloadTestFile } from "@/services/testService/downloadService";
import type { TestDownloadListProps } from "@/models/Test";

const TestDownloadList = () => {
  const [tests, setTests] = useState<TestDownloadListProps[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [testContentMap, setTestContentMap] = useState<{ [key: string]: any }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [downloadLoading, setDownloadLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTests = async () => {
      try {
        setLoading(true);
        setError(null);
        const [normalTests, multiTests] = await Promise.all([
          fetchNormalTests(),
          fetchMultiTests(),
        ]);
        const all = [
          ...normalTests.map((t: any) => ({ ...t, type: "normal" })),
          ...multiTests.map((t: any) => ({ ...t, type: "multi" })),
        ];
        setTests(all);
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки тестов");
      } finally {
        setLoading(false);
      }
    };
    loadTests();
  }, []);

  const handleSelectTest = async (test: TestDownloadListProps) => {
    const isCurrentlySelected = selectedTestId === test._id;
    setSelectedTestId(isCurrentlySelected ? null : test._id);

    if (!isCurrentlySelected && !testContentMap[test._id]) {
      setContentLoading((prev) => ({ ...prev, [test._id]: true }));
      try {
        const content = await getTestById(test._id);
        setTestContentMap((prev) => ({
          ...prev,
          [test._id]: content,
        }));
      } catch (err: any) {
        console.error("Ошибка при получении содержимого теста:", err);
      } finally {
        setContentLoading((prev) => ({ ...prev, [test._id]: false }));
      }
    }
  };

  const handleDownload = async (testId: string, format: 'pdf' | 'docx' | 'gift' | 'qti' | 'moodlexml' | 'csv') => {
    setDownloadLoading((prev) => ({ ...prev, [testId]: true }));
    try {
      await downloadTestFile(testId, format);
    } catch (err) {
      alert("Не удалось скачать файл");
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [testId]: false }));
      setOpenDropdownId(null);
    }
  };

  const getTestTypeConfig = (type: string) => {
    switch (type) {
      case "normal":
        return {
          label: "Обычный",
          color: "text-blue-700",
          bgColor: "bg-gradient-to-r from-blue-50 to-blue-100",
          borderColor: "border-blue-200",
          icon: FileText,
        };
      case "multi":
        return {
          label: "Мульти",
          color: "text-purple-700",
          bgColor: "bg-gradient-to-r from-purple-50 to-purple-100",
          borderColor: "border-purple-200",
          icon: Layers,
        };
      default:
        return {
          label: "Неизвестно",
          color: "text-gray-700",
          bgColor: "bg-gradient-to-r from-gray-50 to-gray-100",
          borderColor: "border-gray-200",
          icon: HelpCircle,
        };
    }
  };

  // Закрытие выпадающего меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId) {
        const target = event.target as HTMLElement;
        if (!target.closest(".dropdown-container")) {
          console.log("Закрываем выпадающее меню");
          setOpenDropdownId(null);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdownId]);

  // Отладочная информация
  console.log("Открытое выпадающее меню:", openDropdownId);
  console.log("Количество тестов:", tests.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Скачать тесты
          </h1>
          <p className="text-lg text-gray-600">Экспорт тестов в разных форматах</p>
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full">
            <span className="text-sm font-medium text-blue-800">
              {tests.length} {tests.length === 1 ? "тест" : "тестов"}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {tests.map((test) => {
            const isSelected = selectedTestId === test._id;
            const testContent = testContentMap[test._id];
            const isContentLoading = contentLoading[test._id];
            const isDownloadLoading = downloadLoading[test._id];
            const typeConfig = getTestTypeConfig(test.type);
            const TypeIcon = typeConfig.icon;

            return (
              <div key={test._id} className="group relative">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-visible">
                  <div className="flex items-center justify-between gap-6 p-8">
                    {/* Левая часть - кликабельная для раскрытия содержимого */}
                    <div
                      className="flex items-center gap-6 flex-1 cursor-pointer"
                      onClick={() => handleSelectTest(test)}
                    >
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="text-xl font-bold text-gray-900">
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

                    {/* Правая часть - выпадающее меню для формата */}
                    <div className="relative dropdown-container">
                      <button
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log(
                            "Кнопка скачать нажата для теста:",
                            test._id
                          );
                          setOpenDropdownId((prev) =>
                            prev === test._id ? null : test._id
                          );
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
                          className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl z-[9999]"
                          style={{
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                            zIndex: 9999,
                          }}
                        >
                          <button
                            className="block w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-150 font-medium border-b border-slate-100"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log("Скачать DOCX для теста:", test._id);
                              handleDownload(test._id, "docx");
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <FileEdit className="w-4 h-4 text-blue-600" />
                              <span>Скачать как DOCX</span>
                            </div>
                          </button>
                          <button
                            className="block w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-150 font-medium"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log("Скачать PDF для теста:", test._id);
                              handleDownload(test._id, "pdf");
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <File className="w-4 h-4 text-red-600" />
                              <span>Скачать как PDF</span>
                            </div>
                          </button>
                          {/* GIFT */}
                          <button
                            className="block w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 font-medium border-b border-slate-100"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDownload(test._id, "gift");
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <File className="w-4 h-4 text-green-600" />
                              <span>Скачать как GIFT</span>
                            </div>
                          </button>

                          {/* QTI */}
                          <button
                            className="block w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 font-medium border-b border-slate-100"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDownload(test._id, "qti");
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <File className="w-4 h-4 text-cyan-600" />
                              <span>Скачать как QTI</span>
                            </div>
                          </button>

                          {/* Moodle XML */}
                          <button
                            className="block w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 font-medium border-b border-slate-100"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDownload(test._id, "moodlexml");
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <File className="w-4 h-4 text-yellow-600" />
                              <span>Скачать как Moodle XML</span>
                            </div>
                          </button>

                          {/* CSV */}
                          <button
                            className="block w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 font-medium"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDownload(test._id, "csv");
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <File className="w-4 h-4 text-fuchsia-600" />
                              <span>Скачать как CSV</span>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Отображение содержимого теста */}
                  {isSelected && (
                    <div className="border-t border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                      <div className="p-8">
                        {isContentLoading ? (
                          <div className="text-blue-600 flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Загрузка содержимого...</span>
                          </div>
                        ) : testContent?.questions ? (
                          <div className="space-y-6">
                            {testContent.questions.map((q: any, i: number) => (
                              <div
                                key={i}
                                className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-400"
                              >
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {i + 1}
                                  </div>
                                  <p className="text-gray-900 font-medium">
                                    {q.question}
                                  </p>
                                </div>
                                {q.options && (
                                  <div className="ml-12 space-y-1">
                                    {q.options.map((opt: string, j: number) => (
                                      <div
                                        key={j}
                                        className="flex items-center gap-2 text-sm text-gray-700"
                                      >
                                        <div className="w-2 h-2 bg-slate-400 rounded-full" />
                                        <span>{opt}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500">Нет содержимого</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestDownloadList;
