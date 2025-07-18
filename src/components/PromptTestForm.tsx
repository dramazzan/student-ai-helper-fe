"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateTest } from "@/services/testService/generationService";
import { NotificationToast } from "./NotificationToast";
import type { Notification } from "@/models/Notification";
import {
  UploadCloud,
  Upload,
  CheckCircle,
  AlertTriangle,
  Loader2,
  MessageSquareText,
} from "lucide-react";

const PromptTestForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const router = useRouter();

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setErrorMessage("");
    }
  };

  const handleSubmit = async () => {
    if (!file && !userPrompt.trim()) {
      setErrorMessage("Введите промпт или загрузите файл!");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (userPrompt.trim()) formData.append("userPrompt", userPrompt.trim());
      formData.append("difficulty", "medium");
      formData.append("questionCount", "5");
      formData.append("questionType", "normal");

      const result = await generateTest(file!, {
        difficulty: "medium",
        questionCount: 5,
        userPrompt,
      });

      console.log("✅ Тест создан:", result);

      addNotification({
        type: "success",
        title: "Тест успешно создан!",
        message:
          file && userPrompt
            ? "Сгенерирован тест из файла и промпта."
            : file
            ? "Сгенерирован тест из файла."
            : "Сгенерирован тест из промпта.",
      });

      setTimeout(() => {
        router.push("/main/tests");
      }, 1500);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || "Ошибка при генерации теста";
      setErrorMessage(errorMsg);
      addNotification({
        type: "error",
        title: "Ошибка генерации",
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {notifications.map((n) => (
        <NotificationToast
          key={n.id}
          notification={n}
          onClose={removeNotification}
        />
      ))}

      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
              <MessageSquareText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Генерация теста
            </h1>
            <p className="text-slate-600">
              Вы можете ввести промпт, загрузить файл или использовать оба
              источника
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Файл (необязательно)
              </label>
              <div className="relative border-2 border-dashed border-slate-300 p-4 rounded-xl">
                <input
                  type="file"
                  accept=".pdf,.docx,.pptx,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {file ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600 w-6 h-6" />
                    <span className="text-slate-900 font-medium">
                      {file.name}
                    </span>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 text-sm">
                    <UploadCloud className="w-10 h-10 mx-auto mb-1" />
                    Нажмите или перетащите файл
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Промпт (необязательно)
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Например: Создай тест с 10 вопросами на тему логарифмов, средней сложности"
              />
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 p-3 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || (!file && !userPrompt.trim())}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Генерация...
                </>
              ) : (
                <>Создать тест</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromptTestForm;
