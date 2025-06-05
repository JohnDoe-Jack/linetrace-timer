export interface ScoreType {
  id: number;
  playerName: string;
  time: number; // 計測タイム（秒）
  divineHandCount: number; // 神の手使用回数
  courseLevel: "beginner" | "intermediate" | "advanced"; // コース難易度
  finalScore: number; // 最終スコア（タイム + ペナルティ）
  createdAt?: string;
}

// スコア作成/更新時のデータ型
export interface ScoreInput {
  playerName: string;
  time: number;
  divineHandCount: number;
  courseLevel: "beginner" | "intermediate" | "advanced";
  finalScore: number;
}
