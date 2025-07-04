export interface AnswerDetail {
  question: string
  options: string[]
  selectedAnswerIndex: number
  selectedAnswerText: string
  correctAnswerIndex: number
  correctAnswerText: string
  isCorrect: boolean
}

export interface Attempt {
  resultId: string
  score: number
  totalQuestions: number
  percentage: number
  completedAt: string
  details: AnswerDetail[]
}

export interface TestProgress {
  testTitle: string
  attempts: Attempt[]
  testId: string
}