export interface ScoreType {
  id: number
  playerName: string
  time: number // 計測タイム（秒）
  divineHandCount: number // 神の手使用回数
  isHardCourse: boolean // コース選択（true: 難しい, false: 簡単）
  finalScore: number // 最終スコア（タイム + ペナルティ）
  createdAt?: string
}

// スコア作成/更新時のデータ型
export interface ScoreInput {
  playerName: string
  time: number
  divineHandCount: number
  isHardCourse: boolean
  finalScore: number
}
