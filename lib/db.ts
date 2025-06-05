import type { ScoreType, ScoreInput } from "./types";
import Database from "better-sqlite3";

// SQLiteデータベースの初期化
let db: Database.Database | null = null;

// データベース接続を取得
export function getDb(): Database.Database | null {
  if (!db) {
    // サーバーサイドでのみ実行
    if (typeof window === "undefined") {
      db = new Database("line-trace.db");

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
      `);
    }
  }

  return db;
}

// データベースの型定義
interface DatabaseScore {
  id: number;
  playerName: string;
  time: number;
  divineHandCount: number;
  isHardCourse: number; // SQLiteでは0/1
  finalScore: number;
  createdAt: string;
}

// スコア一覧を取得
export function getAllScores(): ScoreType[] {
  const db = getDb();

  if (!db) {
    console.error("データベース接続エラー");
    return [];
  }

  try {
    const scores = db
      .prepare(
        `
        SELECT 
          id, playerName, time, divineHandCount, 
          isHardCourse, finalScore, createdAt
        FROM scores
        ORDER BY finalScore ASC
        `
      )
      .all() as DatabaseScore[];

    // SQLiteのブール値を変換
    return scores.map(
      (score: DatabaseScore): ScoreType => ({
        id: score.id,
        playerName: score.playerName,
        time: score.time,
        divineHandCount: score.divineHandCount,
        isHardCourse: Boolean(score.isHardCourse),
        finalScore: score.finalScore,
        createdAt: score.createdAt,
      })
    );
  } catch (error: unknown) {
    console.error("スコア取得エラー:", error);
    return [];
  }
}

// スコアを追加
export function insertScore(score: ScoreInput): number {
  const db = getDb();

  if (!db) {
    throw new Error("データベース接続エラー");
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO scores (playerName, time, divineHandCount, isHardCourse, finalScore)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      score.playerName,
      score.time,
      score.divineHandCount,
      score.isHardCourse ? 1 : 0,
      score.finalScore
    );

    if (typeof result.lastInsertRowid !== "number") {
      throw new Error("スコアの挿入に失敗しました");
    }

    return result.lastInsertRowid;
  } catch (error: unknown) {
    console.error("スコア追加エラー:", error);
    throw error;
  }
}

// スコアを更新
export function updateScoreById(id: number, score: ScoreInput): boolean {
  const db = getDb();

  if (!db) {
    throw new Error("データベース接続エラー");
  }

  try {
    const stmt = db.prepare(`
      UPDATE scores
      SET playerName = ?, time = ?, divineHandCount = ?, isHardCourse = ?, finalScore = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      score.playerName,
      score.time,
      score.divineHandCount,
      score.isHardCourse ? 1 : 0,
      score.finalScore,
      id
    );

    return result.changes > 0;
  } catch (error: unknown) {
    console.error("スコア更新エラー:", error);
    throw error;
  }
}

// スコアを削除
export function deleteScoreById(id: number): boolean {
  const db = getDb();

  if (!db) {
    throw new Error("データベース接続エラー");
  }

  try {
    const stmt = db.prepare(`
      DELETE FROM scores
      WHERE id = ?
    `);

    const result = stmt.run(id);

    return result.changes > 0;
  } catch (error: unknown) {
    console.error("スコア削除エラー:", error);
    throw error;
  }
}
