"use client";

import { useState } from "react";
import { generateTestFromUrl } from "@/services/testService";
import {
  Link,
  FileText,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Settings
} from "lucide-react";

const difficultyLabels: Record<string, string> = {
  easy: "Лёгкий",
  medium: "Средний",
  hard: "Сложный"
};

const GenerateTestFromUrlForm = () => {
  const [url, setUrl] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [questionType, setQuestionType] = useState("тест с выбором");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!url) {
      setErrorMessage("Введите ссылку на сайт!");
      return;
    }

    if (questionCount < 5 || questionCount > 50) {
      setErrorMessage("Количество вопросов должно быть от 5 до 50");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const result = await generateTestFromUrl(url, {
        difficulty,
        questionCount,
        questionType
      });
      console.log("✅ Тест создан из URL:", result);
      alert("Тест успешно создан!");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.response?.data?.message || "Ошибка при генерации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Link className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Генерация теста из URL
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {errorMessage && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
              <AlertTriangle className="w-5 h-5 mt-1 text-red-500" />
              <div>
                <p className="font-medium">Ошибка:</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Ссылка на веб-страницу
            </label>
            <input
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900">Настройки теста</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Сложность</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="easy">Лёгкий</option>
                  <option value="medium">Средний</option>
                  <option value="hard">Сложный</option>
                </select>
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                    difficulty === "easy"
                      ? "text-emerald-700 bg-emerald-100 border-emerald-200"
                      : difficulty === "medium"
                      ? "text-amber-700 bg-amber-100 border-amber-200"
                      : "text-red-700 bg-red-100 border-red-200"
                  }`}
                >
                  Выбрано: {difficultyLabels[difficulty]}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Количество вопросов
                </label>
                <input
                  type="number"
                  value={questionCount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 5 && val <= 50) setQuestionCount(val);
                  }}
                  min={5}
                  max={50}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Тип вопроса</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="тест с выбором">Тест с выбором</option>
                <option value="открытые">Открытые</option>
                <option value="с одним выбором">С одним выбором</option>
                <option value="с несколькими">С несколькими</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !url}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-lg bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Генерация...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>Сгенерировать тест</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateTestFromUrlForm;
