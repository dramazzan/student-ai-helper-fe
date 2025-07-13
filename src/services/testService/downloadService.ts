import api from "@/services/api";

export const downloadTestFile = async (
  testId: string,
  format: 'pdf' | 'docx' | 'gift' | 'qti' | 'moodlexml' | 'csv' | 'pptx' | 'txt'
) => {
  const response = await api.get(`/tests/${testId}/download/${format}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `test-${testId}.${format}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
