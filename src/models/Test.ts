export interface Module {
  _id: string
  originalFileName: string
  createdAt: string
}

export interface Test {
  _id: string
  title: string
  questionCount: number
  difficulty: string
  createdAt: string
  summary?: string
  sourceType: 'file' | 'url' | 'weak-topic' | 'file+prompt'
  sourceDetails?: string[]
}

export interface ModuleListProps {
  modules: Module[]
}

export interface TestProgressInfo {
  score: number
  percentage: number
  attemptsCount?: number // Optional, added to track the number of attempts
}

export interface TestTabsProps {
  normalTests: Test[]
}

export interface TestDownloadListProps {
  _id: string
  title: string
  type: 'normal' | 'multi'
}


export interface QuestionDetail {
  question: string
  selected: number
  correct: number
  isCorrect: boolean
}

export interface TestResultData {
  testTitle: string
  testId: string
  score: number
  total: number
  percentage: number
  completedAt: string
  details: QuestionDetail[]
}


export interface TestGenerationOptions {
  difficulty: string
  questionCount: number
  questionType: string
  testType: string
}
