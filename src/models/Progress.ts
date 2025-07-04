export interface WeakTopic {
  topic: string
  mistakes: number
  recommendation: string
}

export interface LowScoreTest {
  title: string
  score: number
  total: number
  date: string
}

export interface ProgressData {
  totalTestsTaken: number
  averageScore: number
  progressPercent: number
  weakTopics: WeakTopic[]
  lowScoreTests: LowScoreTest[]
  recommendations: string[]
  motivation: string
}