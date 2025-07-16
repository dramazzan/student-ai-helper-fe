import api from "@/services/api";

export const generateTest = async (
  file: File,
  options: {
    difficulty: string;
    questionCount: number;
    questionType: string;
  }
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("difficulty", options.difficulty);
  formData.append("questionCount", String(options.questionCount));
  formData.append("questionType", options.questionType);

  const response = await api.post("/test/generate-test", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const generateMultiTest = async (
  file: File,
  {
    difficulty,
    questionCount,
  }: {
    difficulty: string;
    questionCount: number;
  }
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("difficulty", difficulty);
  formData.append("questionCount", String(questionCount));

  const response = await api.post("/test/generate-multi", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const generateTestFromUrl = async (
  url: string,
  {
    difficulty,
    questionCount,
    questionType,
    testType
  }: {
    difficulty?: string;
    questionCount?: number;
    questionType?: string;
    testType?: string; 
  }
) => {
  const formData = new FormData();
  formData.append("url", url);
  if (difficulty) formData.append("difficulty", difficulty);
  if (questionCount !== undefined) formData.append("questionCount", String(questionCount));
  if (questionType) formData.append("questionType", questionType);
  if (testType) formData.append("testType", testType);

  const res = await api.post("/generate-test/from-url", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};
