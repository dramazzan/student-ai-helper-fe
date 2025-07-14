"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  AlertTriangle,
  FolderDown,
  Lightbulb,
  TrendingUp,
  Target,
  BookOpen,
  Calendar,
  ChevronRight,
  Zap,
  Brain,
} from "lucide-react";

import { ProgressData, WeakTopic, LowScoreTest } from "@/models/Progress";

const ProgressOverview = ({
  data,
  isLoading = false,
}: {
  data?: ProgressData;
  isLoading?: boolean;
}) => {
  const [animatedValues, setAnimatedValues] = useState({
    totalTests: 0,
    averageScore: 0,
    progress: 0,
  });

  useEffect(() => {
    if (data && !isLoading) {
      const duration = 1500;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setAnimatedValues({
          totalTests: Math.round(data.totalTestsTaken * progress),
          averageScore: Math.round(data.averageScore * progress),
          progress: Math.round(data.progressPercent * progress),
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedValues({
            totalTests: data.totalTestsTaken,
            averageScore: data.averageScore,
            progress: data.progressPercent,
          });
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [data, isLoading]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-emerald-600";
    if (score >= 60) return "from-amber-500 to-amber-600";
    if (score >= 40) return "from-orange-500 to-orange-600";
    return "from-red-500 to-red-600";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-emerald-700";
    if (score >= 60) return "text-amber-700";
    if (score >= 40) return "text-orange-700";
    return "text-red-700";
  };

  const CircularProgress = ({
    percentage,
    size = 80,
    strokeWidth = 8,
  }: any) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${
      (percentage / 100) * circumference
    } ${circumference}`;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            className={`transition-all duration-1000 ease-out ${getScoreTextColor(
              percentage
            )}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-lg font-bold ${getScoreTextColor(percentage)}`}
          >
            {percentage}%
          </span>
        </div>
      </div>
    );
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-7 bg-slate-200 rounded w-48 animate-pulse" />
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-50 rounded-xl p-6 animate-pulse"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                    <div className="w-16 h-8 bg-slate-200 rounded" />
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-6 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <LineChart className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Учебный прогресс
            </h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-md transition-all duration-200 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-900">
                    {animatedValues.totalTests}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    ТЕСТОВ
                  </div>
                </div>
              </div>
              <p className="text-sm text-blue-700 font-medium">
                Всего тестов пройдено
              </p>
            </div>

            <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 hover:shadow-md transition-all duration-200 border border-emerald-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${getScoreTextColor(
                      animatedValues.averageScore
                    )}`}
                  >
                    {animatedValues.averageScore}%
                  </div>
                  <div className="text-xs text-emerald-600 font-medium">
                    СРЕДНИЙ
                  </div>
                </div>
              </div>
              <p className="text-sm text-emerald-700 font-medium">
                Средний балл
              </p>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:shadow-md transition-all duration-200 border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CircularProgress
                  percentage={animatedValues.progress}
                  size={60}
                  strokeWidth={6}
                />
              </div>
              <p className="text-sm text-purple-700 font-medium">
                Общий прогресс
              </p>
            </div>
          </div>
        </div>
      </div>

      {Array.isArray(data.weakTopics) && data.weakTopics.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Слабые темы
              </h3>
              <div className="ml-auto text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {data.weakTopics.length}{" "}
                {data.weakTopics.length === 1 ? "тема" : "тем"}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {data.weakTopics.map((topic, i) => (
              <div
                key={i}
                className="group bg-red-50 border border-red-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-red-900">
                        {topic.topic}
                      </h4>
                      <div className="inline-flex items-center px-2 py-1 bg-red-200 text-red-800 text-xs font-medium rounded-full">
                        {topic.mistakes}{" "}
                        {topic.mistakes === 1 ? "ошибка" : "ошибок"}
                      </div>
                    </div>
                    <p className="text-sm text-red-700 leading-relaxed">
                      {topic.recommendation}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(data.lowScoreTests) && data.lowScoreTests.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <FolderDown className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Тесты с низкими баллами
              </h3>
              <div className="ml-auto text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {data.lowScoreTests.length}{" "}
                {data.lowScoreTests.length === 1 ? "тест" : "тестов"}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-3">
            {data.lowScoreTests.map((test, i) => (
              <div
                key={i}
                className="group bg-orange-50 border border-orange-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-900">
                        {test.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(test.date).toLocaleDateString("ru-RU")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-orange-900">
                      {Number.isFinite(test.score) &&
                      Number.isFinite(test.total)
                        ? `${test.score}/${test.total}`
                        : "—"}
                    </div>
                    <div className="text-xs text-orange-600">
                      {Number.isFinite(test.score) &&
                      Number.isFinite(test.total) &&
                      test.total > 0
                        ? `${Math.round((test.score / test.total) * 100)}%`
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.motivation && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Мотивация</h3>
              <p className="text-purple-100 leading-relaxed italic">
                {data.motivation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressOverview;
