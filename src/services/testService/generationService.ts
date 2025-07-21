import api from "@/services/api";

export const generateTest = async (
  file: File | null,
  options: {
    difficulty: string;
    questionCount: number;
    userPrompt?: string;
  }
) => {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  }

  formData.append("difficulty", options.difficulty);
  formData.append("questionCount", String(options.questionCount));

  if (options.userPrompt) {
    formData.append("userPrompt", options.userPrompt);
  }

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
  { difficulty, questionCount, questionType, testType }: {
    difficulty?: string;
    questionCount?: number;
    questionType?: string;
    testType?: string;
  }
) => {
  const res = await api.post("/generate-test/from-url", {
    url,
    difficulty,
    questionCount,
    questionType,
    testType,
  });

  return res.data;
};



export const generateTestsFromWeakTopics = async (options: {
  difficulty?: string;
  questionCount?: number;
  questionType?: string;
  testType?: string;
}) => {
  const response = await api.post("/tests/weak-topics/generate", { options });
  return response.data;
};



export const deleteTestById = async (testId: string) => {
  const response = await api.delete(`/test/delete/${testId}`)
  return response.data
}
