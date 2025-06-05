import type { Database } from "better-sqlite3"
import type { ScoreType, ScoreInput } from "./types"

// SQLiteデータベースの初期化
let db: Database

// データベース接続を取得
export function getDb() {
  if (!db) {
    // サーバーサイドでのみ実行
    if (typeof window === "undefined") {
      const sqlite = require("better-sqlite3")
      db = new sqlite("line-trace.db")

      // スコアテーブルの作成（存在しない場合）
      db.exec(`
        CREATE TABLE IF NOT EXISTS scores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          playerName TEXT NOT NULL,
          time REAL NOT NULL,
          divineHandCount INTEGER NOT NULL DEFAULT 0,
          isHardCourse INTEGER NOT NULL DEFAULT 1,
          finalScore REAL NOT NULL,
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `)
    }
  }

  return db
}

// スコア一覧を取得
export function getAllScores(): ScoreType[] {
  const db = getDb()

  try {
    const scores = db
      .prepare(`
      SELECT 
        id, playerName, time, divineHandCount, 
        isHardCourse, finalScore, createdAt
      FROM scores
      ORDER BY finalScore ASC
    `)
      .all()

    // SQLiteのブール値を変換
    return scores.map((score) => ({
      ...score,
      isHardCourse: Boolean(score.isHardCourse),
    }))
  } catch (error) {
    console.error("スコア取得エラー:", error)
    return []
  }
}

// スコアを追加
export function insertScore(score: ScoreInput): number {
  const db = getDb()

  try {
    const result = db
      .prepare(`
      INSERT INTO scores (playerName, time, divineHandCount, isHardCourse, finalScore)
      VALUES (?, ?, ?, ?, ?)
    `)
      .run(score.playerName, score.time, score.divineHandCount, score.isHardCourse ? 1 : 0, score.finalScore)

    return result.lastInsertRowid as number
  } catch (error) {
    console.error("スコア追加エラー:", error)
    throw error
  }
}

// スコアを更新
export function updateScoreById(id: number, score: ScoreInput): boolean {
  const db = getDb()

  try {
    const result = db
      .prepare(`
      UPDATE scores
      SET playerName = ?, time = ?, divineHandCount = ?, isHardCourse = ?, finalScore = ?
      WHERE id = ?
    `)
      .run(score.playerName, score.time, score.divineHandCount, score.isHardCourse ? 1 : 0, score.finalScore, id)

    return result.changes > 0
  } catch (error) {
    console.error("スコア更新エラー:", error)
    throw error
  }
}

// スコアを削除
export function deleteScoreById(id: number): boolean {
  const db = getDb()

  try {
    const result = db
      .prepare(`
      DELETE FROM scores
      WHERE id = ?
    `)
      .run(id)

    return result.changes > 0
  } catch (error) {
    console.error("スコア削除エラー:", error)
    throw error
  }
}
