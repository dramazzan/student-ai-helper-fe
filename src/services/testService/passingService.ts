import api from "@/services/api";

interface Answer {
  questionId: string;
  selectedAnswer: number;
}

interface SubmitTestPayload {
  testId: string;
  answers: Answer[];
}

export const submitTestAnswers = async (payload: SubmitTestPayload) => {
  const response = await api.post('/test/passing/submit-test', payload);
  return response.data;
};

export const getTestProgressByTestId = async (testId: string) => {
  const response = await api.get(`/progress/test/result/${testId}`);
  return response.data;
};

export const fetchModuleProgress = async (moduleId: string): Promise<number> => {
  const res = await api.get(`/progress/module/${moduleId}`);
  if (res.status !== 200) throw new Error("Ошибка при получении прогресса модуля");
  return res.data.percentage || 0;
};

export const getTestResult = async (testId: string) => {
  const response = await api.get(`/progress/test/${testId}`);
  return response.data;
};
