"use client"

import { useState } from "react"
import GenerateTestForm from "@/components/GenerateTestForm"
import GenerateTestFromUrlForm from "@/components/GenerateTestFromUrlForm"
import { FileText, Globe, Sparkles, Zap, Target, BookOpen } from "lucide-react"
import Link from "next/link"
import PromptTestForm from "@/components/PromptTestForm"

const GeneratePage = () => {
  const [activeTab, setActiveTab] = useState<"text" | "url">("text")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/30">
      <div className="max-w-5xl mx-auto px-6 py-12">
           {/* Prompt Test Form Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 border-b border-slate-200/60">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Быстрая генерация</h3>
                <p className="text-slate-600 text-lg">Создайте тест одним промптом</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <PromptTestForm />
          </div>
        </div>
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full text-sm font-medium mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Генерация с ИИ
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
            Создание тестов
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Выберите способ создания теста: из текста или веб-страницы
          </p>
        </div>

        {/* Main Generation Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden mb-12">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200/60 bg-slate-50/50">
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 flex items-center justify-center gap-3 px-8 py-6 font-semibold transition-all duration-300 ${
                activeTab === "text"
                  ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-b-3 border-green-500 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <FileText className="w-5 h-5" />
              Из текста
            </button>
            <button
              onClick={() => setActiveTab("url")}
              className={`flex-1 flex items-center justify-center gap-3 px-8 py-6 font-semibold transition-all duration-300 ${
                activeTab === "url"
                  ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-b-3 border-blue-500 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Globe className="w-5 h-5" />
              Из URL
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-10">
            {activeTab === "text" && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl mb-4">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Генерация из текста</h2>
                  <p className="text-slate-600 text-lg">
                    Вставьте текст и получите готовый тест с настраиваемыми параметрами
                  </p>
                </div>
                <GenerateTestForm />
              </div>
            )}
            {activeTab === "url" && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl mb-4">
                    <Globe className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Генерация из URL</h2>
                  <p className="text-slate-600 text-lg">
                    Укажите ссылку на веб-страницу для создания теста на основе её содержимого
                  </p>
                </div>
                <GenerateTestFromUrlForm />
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Советы для лучших результатов</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100/50 border border-green-200/50">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Используйте структурированные тексты с четкими фактами</span>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Выбирайте сложность в зависимости от аудитории</span>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200/50">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Для коротких тестов используйте 5-15 вопросов</span>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200/50">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Проверьте качество исходного материала</span>
            </div>
          </div>
        </div>

     

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-10 border border-white/50 shadow-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl mb-6">
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Готовы посмотреть созданные тесты?</h3>
          <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
            Перейдите к списку ваших тестов и начните проверку знаний
          </p>
          <Link
            href="/main/tests"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5" />
            Перейти к тестам
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GeneratePage
