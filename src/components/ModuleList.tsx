'use client';

import React, { useEffect, useState } from 'react';
import {
  fetchTestsByModule,
  fetchModuleProgress,
  getTestProgressByTestId,
} from '@/services/testService';
import { useRouter } from 'next/navigation';

interface Module {
  _id: string;
  originalFileName: string;
  createdAt: string;
}

interface Test {
  _id: string;
  title: string;
  questionCount: number;
  difficulty: string;
  createdAt: string;
}

interface ModuleListProps {
  modules: Module[];
}

interface TestProgressInfo {
  score: number;
  percentage: number;
}

const ModuleList: React.FC<ModuleListProps> = ({ modules }) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [progressLoading, setProgressLoading] = useState<Record<string, boolean>>({});
  const [testProgressMap, setTestProgressMap] = useState<Record<string, TestProgressInfo>>({});
  const router = useRouter();

  const handleModuleClick = async (moduleId: string) => {
    if (selectedModuleId === moduleId) {
      setSelectedModuleId(null);
      setTests([]);
      return;
    }

    setSelectedModuleId(moduleId);
    setLoading(true);
    try {
      const response = await fetchTestsByModule(moduleId);
      const fetchedTests = Array.isArray(response) ? response : [];
      setTests(fetchedTests);

      // Получаем прогресс по каждому тесту
      const testProgresses: Record<string, TestProgressInfo> = {};
      await Promise.all(
        fetchedTests.map(async (test) => {
          try {
            const data = await getTestProgressByTestId(test._id);
            if (data.attempts && data.attempts.length > 0) {
              const best = data.attempts.reduce((max: any, attempt: any) =>
                attempt.percentage > max.percentage ? attempt : max
              );
              testProgresses[test._id] = {
                score: best.score,
                percentage: best.percentage,
              };
            }
          } catch (e) {
            // игнорируем, если нет результатов
          }
        })
      );
      setTestProgressMap(testProgresses);
    } catch (err) {
      console.error('Ошибка загрузки тестов:', err);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProgress = async () => {
      const loadingMap: Record<string, boolean> = {};
      modules.forEach((mod) => {
        loadingMap[mod._id] = true;
      });
      setProgressLoading(loadingMap);

      try {
        const progressResults = await Promise.all(
          modules.map(async (mod) => {
            try {
              const progress = await fetchModuleProgress(mod._id);
              return { id: mod._id, progress };
            } catch (e) {
              return { id: mod._id, progress: 0 };
            }
          })
        );

        const map: Record<string, number> = {};
        progressResults.forEach(({ id, progress }) => {
          map[id] = progress;
        });

        setProgressMap(map);
      } finally {
        const doneMap: Record<string, boolean> = {};
        modules.forEach((mod) => {
          doneMap[mod._id] = false;
        });
        setProgressLoading(doneMap);
      }
    };

    loadProgress();
  }, [modules]);

  const getBadgeColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (!Array.isArray(modules) || modules.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md text-center text-gray-500">
        Нет доступных модулей.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Модули</h2>
      <ul className="space-y-6">
        {modules.map((module) => (
          <li key={module._id}>
            <div
              className="p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => handleModuleClick(module._id)}
            >
              <div className="flex justify-between items-center mb-2 gap-4 flex-wrap">
                <h3 className="text-lg font-semibold text-gray-800 break-words whitespace-pre-wrap">
                  {decodeURIComponent(module.originalFileName)}
                </h3>
                {progressLoading[module._id] ? (
                  <div className="text-sm text-blue-500 animate-pulse">
                    Загрузка прогресса...
                  </div>
                ) : (
                  <div className="flex flex-col items-end min-w-[120px]">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-blue-500 transition-all duration-300"
                        style={{ width: `${progressMap[module._id] || 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 mt-1">
                      {progressMap[module._id] || 0}%
                    </span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600">
                Дата: {new Date(module.createdAt).toLocaleDateString()}
              </p>
            </div>

            {selectedModuleId === module._id && (
              <div className="mt-4 pl-4 border-l-2 border-blue-200">
                {loading ? (
                  <p className="text-sm text-blue-600">Загрузка тестов...</p>
                ) : Array.isArray(tests) && tests.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Нет тестов для этого модуля.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {tests.map((test) => {
                      const progress = testProgressMap[test._id];
                      return (
                        <li
                          key={test._id}
                          className="p-3 bg-white rounded-xl shadow border flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        >
                          <div>
                            <h4 className="text-md font-semibold text-gray-800">
                              {test.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Вопросов: {test.questionCount} • Сложность:{" "}
                              {test.difficulty} •{" "}
                              {new Date(test.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 md:flex-row md:items-center">
                            {progress && (
                              <p
                                className={`text-sm px-3 py-1 rounded ${getBadgeColor(
                                  progress.percentage
                                )}`}
                              >
                                Лучший результат: {progress.score} (
                                {progress.percentage}%)
                              </p>
                            )}
                            <div className="flex gap-2">
                              <button
                                className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={() =>
                                  router.push(`/main/tests/passing/${test._id}`)
                                }
                              >
                                Пройти
                              </button>
                              {progress && (
                                <button
                                  onClick={() =>
                                    router.push(
                                      `/main/tests/history/${test._id}`
                                    )
                                  }
                                  className="text-sm px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                                >
                                  История
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleList;
