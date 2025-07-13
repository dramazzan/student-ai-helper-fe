import api from "@/services/api";

export const fetchNormalTests = async () => {
  const res = await api.get("/test/normal");
  if (res.status !== 200) throw new Error("Ошибка при получении нормальных тестов");
  return res.data.tests || [];
};

export const fetchMultiTests = async () => {
  const res = await api.get("/test/multi");
  if (res.status !== 200) throw new Error("Ошибка при получении мульти тестов");
  return res.data.tests || [];
};

export const fetchTestModule = async () => {
  const res = await api.get("/test/module");
  if (res.status !== 200) throw new Error("Ошибка при получении тестового модуля");
  return res.data.modules;
};

export const fetchTestsByModule = async (id: string) => {
  const res = await api.get(`/test/module/${id}`);
  if (res.status !== 200) throw new Error("Ошибка при получении тестов по модулю");
  return res.data.tests;
};

export const getTestById = async (testId: string) => {
  const response = await api.get(`/test/${testId}`);
  return response.data;
};
