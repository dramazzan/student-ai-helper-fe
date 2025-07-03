import api from "./api";


interface Answer {
  questionId: string
  selectedAnswer: number
}

interface SubmitTestPayload {
  testId: string
  answers: Answer[]
}

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
    headers: {
      "Content-Type": "multipart/form-data",
    },
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
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const fetchNormalTests = async () => {
    try {
    const res = await api.get("/test/normal");
    console.log("Response from /test/normal:", res);
    if (res.status !== 200) {
      throw new Error("Ошибка при получении нормальных тестов");
    }
    return res.data.tests;
  } catch (e) {
    console.error("Error fetching normal tests:", e);
    throw e;
  }
};

export const fetchMultiTests = async () => {
  try {
    const res = await api.get("/test/multi");
    console.log("Response from /test/multi:", res);
    if (res.status !== 200) {
      throw new Error("Ошибка при получении мульти тестов");
    }
    return res.data;
  } catch (e) {
    console.error("Error fetching multi tests:", e);
    throw e;
  }
};


export const fetchTestModule = async () =>{
  try{
    const res = await api.get('/test/module');
    console.log("Response from /test/module:", res);
    if(res.status !== 200){
      throw new Error("Ошибка при получении тестового модуля")
    }
    return res.data.modules;
  }catch(e){
    console.error("Error fetching test module:", e);
    throw e;
  }
}


export const fetchTestsByModule = async (id: string) => {
  try {
    const res = await api.get(`/test/module/${id}`);
    console.log("Response from /test/module/:id:", res);
    if (res.status !== 200) {
      throw new Error("Ошибка при получении тестового модуля по ID");
    }
    return res.data.tests;
  } catch (e) {
    console.error("Error fetching test module by ID:", e);
    throw e;
  }
}


export const getTestById = async (testId: string) => {
  try {
    const response = await api.get(`/test/${testId}`)
    return response.data
  } catch (error) {
    console.error('Ошибка при получении теста:', error)
    throw error
  }
}

export const submitTestAnswers = async (payload: SubmitTestPayload) => {
  try {
    const response = await api.post('/test/passing/submit-test', payload)
    return response.data 
  } catch (error: any) {
    console.error('Ошибка при отправке теста:', error.response?.data || error.message)
    throw error
  }
}

export const getTestProgressByTestId = async (testId: string) => {
  try {
    const response = await api.get(`/progress/test/result/${testId}`)
    return response.data
  } catch (error: any) {
    console.error('Ошибка при получении истории тестов:', error.response?.data || error.message)
    throw error
  }
}