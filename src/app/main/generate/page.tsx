"use client"

import { useState } from "react"
import GenerateTestForm from "@/components/GenerateTestForm"
import GenerateTestFromUrlForm from "@/components/GenerateTestFromUrlForm"
import { FileText, Globe, Sparkles, Zap, Target, BookOpen, ArrowRight, CheckCircle, Clock, Users } from "lucide-react"
import Link from "next/link"
import PromptTestForm from "@/components/PromptTestForm"

const GeneratePage = () => {
  const [activeTab, setActiveTab] = useState<"text" | "url">("text")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-50/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200/30 to-red-300/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-gray-200/30 to-gray-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-red-100/20 to-red-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-50 to-red-100 text-[#C8102E] rounded-full text-sm font-semibold mb-8 shadow-lg border border-white/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Генерация с ИИ
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-black via-[#C8102E] to-black bg-clip-text text-transparent mb-6 leading-tight">
            Создание тестов
          </h1>

          <p className="text-xl text-[#666666] max-w-3xl mx-auto leading-relaxed mb-12">
            Превратите любой контент в интерактивный тест за считанные секунды с помощью искусственного интеллекта
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#E0E0E0] shadow-lg">
              <Clock className="w-6 h-6 text-emerald-600" />
              <div className="text-left">
                <div className="font-bold text-black">30 сек</div>
                <div className="text-sm text-[#666666]">Время создания</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#E0E0E0] shadow-lg">
              <CheckCircle className="w-6 h-6 text-[#C8102E]" />
              <div className="text-left">
                <div className="font-bold text-black">99%</div>
                <div className="text-sm text-[#666666]">Точность</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#E0E0E0] shadow-lg">
              <Users className="w-6 h-6 text-[#B00020]" />
              <div className="text-left">
                <div className="font-bold text-black">10K+</div>
                <div className="text-sm text-[#666666]">Пользователей</div>
              </div>
            </div>
          </div>
        </div>

                 {/* Quick Generation Section */}
        <div className="bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-lg rounded-3xl border border-[#E0E0E0] shadow-2xl overflow-hidden mb-16 transform hover:scale-[1.02] transition-all duration-500">
          <div className="bg-gradient-to-r from-red-50/50 via-red-100/30 to-red-50/50 p-8 border-b border-[#E0E0E0]">
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#C8102E] to-[#B00020] rounded-2xl shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-black mb-2">Быстрая генерация</h3>
                <p className="text-[#666666] text-lg">Создайте тест одним промптом за несколько секунд</p>
              </div>
            </div>
          </div>
          <div className="p-10">
            <PromptTestForm />
          </div>
        </div>

       

        {/* Main Generation Section */}
        <div className="bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-[#E0E0E0] overflow-hidden mb-16">
          {/* Enhanced Tab Navigation */}
          <div className="flex border-b border-[#E0E0E0] bg-gradient-to-r from-gray-50/80 to-gray-100/50">
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 flex items-center justify-center gap-4 px-10 py-8 font-bold text-lg transition-all duration-500 relative overflow-hidden group ${
                activeTab === "text"
                  ? "bg-gradient-to-r from-red-50/50 to-red-100/30 text-[#C8102E] shadow-lg"
                  : "text-[#666666] hover:text-black hover:bg-white/60"
              }`}
            >
              {activeTab === "text" && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-50/30 to-red-100/20 animate-pulse" />
              )}
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                  activeTab === "text"
                    ? "bg-gradient-to-r from-[#C8102E] to-[#B00020] text-white shadow-lg"
                    : "bg-gray-200 text-[#666666] group-hover:bg-gray-300"
                }`}
              >
                <FileText className="w-6 h-6" />
              </div>
              <span className="relative z-10">Из текста</span>
              {activeTab === "text" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C8102E] to-[#B00020]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("url")}
              className={`flex-1 flex items-center justify-center gap-4 px-10 py-8 font-bold text-lg transition-all duration-500 relative overflow-hidden group ${
                activeTab === "url"
                  ? "bg-gradient-to-r from-red-50/50 to-red-100/30 text-[#C8102E] shadow-lg"
                  : "text-[#666666] hover:text-black hover:bg-white/60"
              }`}
            >
              {activeTab === "url" && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-50/30 to-red-100/20 animate-pulse" />
              )}
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                  activeTab === "url"
                    ? "bg-gradient-to-r from-[#C8102E] to-[#B00020] text-white shadow-lg"
                    : "bg-gray-200 text-[#666666] group-hover:bg-gray-300"
                }`}
              >
                <Globe className="w-6 h-6" />
              </div>
              <span className="relative z-10">Из URL</span>
              {activeTab === "url" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C8102E] to-[#B00020]" />
              )}
            </button>
          </div>

          {/* Enhanced Tab Content */}
          <div className="p-12">
            {activeTab === "text" && (
              <div className="space-y-10 animate-in fade-in-50 duration-500">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-50 to-red-100 rounded-3xl mb-6 shadow-lg">
                    <FileText className="w-10 h-10 text-[#C8102E]" />
                  </div>
                  <h2 className="text-3xl font-bold text-black mb-4">Генерация из текста</h2>
                  <p className="text-[#666666] text-xl max-w-2xl mx-auto leading-relaxed">
                    Вставьте любой текст и получите профессиональный тест с настраиваемыми параметрами
                  </p>
                </div>
                <GenerateTestForm />
              </div>
            )}

            {activeTab === "url" && (
              <div className="space-y-10 animate-in fade-in-50 duration-500">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-50 to-red-100 rounded-3xl mb-6 shadow-lg">
                    <Globe className="w-10 h-10 text-[#C8102E]" />
                  </div>
                  <h2 className="text-3xl font-bold text-black mb-4">Генерация из URL</h2>
                  <p className="text-[#666666] text-xl max-w-2xl mx-auto leading-relaxed">
                    Укажите ссылку на веб-страницу для автоматического создания теста на основе её содержимого
                  </p>
                </div>
                <GenerateTestFromUrlForm />
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Tips Section */}
        <div className="bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-lg rounded-3xl border border-[#E0E0E0] shadow-2xl p-10 mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-[#C8102E] to-[#B00020] rounded-2xl shadow-lg">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black">Советы для лучших результатов</h3>
              <p className="text-[#666666]">Следуйте этим рекомендациям для создания качественных тестов</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { color: "emerald", text: "Используйте структурированные тексты с четкими фактами и определениями" },
              { color: "blue", text: "Выбирайте уровень сложности в зависимости от целевой аудитории" },
              { color: "purple", text: "Для эффективного тестирования используйте 5-15 вопросов" },
              { color: "orange", text: "Убедитесь в качестве и актуальности исходного материала" },
            ].map((tip, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100/50 border border-[#E0E0E0] hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="w-3 h-3 bg-[#C8102E] rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300" />
                <span className="text-[#666666] font-medium leading-relaxed">{tip.text}</span>
              </div>
            ))}
          </div>
        </div>



        {/* Enhanced CTA Section */}
        <div className="text-center bg-gradient-to-r from-red-50 via-gray-50 to-red-50 rounded-3xl p-12 border border-[#E0E0E0] shadow-2xl backdrop-blur-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#C8102E] to-[#B00020] rounded-3xl mb-8 shadow-xl">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-black mb-4">Готовы увидеть магию в действии?</h3>
          <p className="text-[#666666] text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Перейдите к списку ваших тестов и начните революцию в обучении
          </p>
          <Link
            href="/main/tests"
            className="group inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[#C8102E] via-[#B00020] to-[#C8102E] text-white font-bold text-lg rounded-2xl hover:from-[#B00020] hover:via-[#C8102E] hover:to-[#B00020] transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
          >
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            Перейти к тестам
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GeneratePage
