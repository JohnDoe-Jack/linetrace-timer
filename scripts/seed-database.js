const sqlite3 = require("better-sqlite3")
const db = new sqlite3("line-trace.db")

console.log("データベースの初期化を開始します...")

// スコアテーブルの作成（既存の場合は削除）
db.exec(`
  DROP TABLE IF EXISTS scores;
  
  CREATE TABLE scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playerName TEXT NOT NULL,
    time REAL NOT NULL,
    divineHandCount INTEGER NOT NULL DEFAULT 0,
    isHardCourse INTEGER NOT NULL DEFAULT 1,
    finalScore REAL NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
`)

console.log("スコアテーブルを作成しました")

// サンプルデータの挿入
const sampleScores = [
  {
    playerName: "山田太郎",
    time: 45.67,
    divineHandCount: 2,
    isHardCourse: 1,
    finalScore: 55.67, // 45.67 + (2 * 5)
  },
  {
    playerName: "佐藤花子",
    time: 42.31,
    divineHandCount: 0,
    isHardCourse: 1,
    finalScore: 42.31, // 42.31 + 0
  },
  {
    playerName: "鈴木一郎",
    time: 38.92,
    divineHandCount: 1,
    isHardCourse: 0,
    finalScore: 53.92, // 38.92 + 5 + 10
  },
  {
    playerName: "高橋次郎",
    time: 41.05,
    divineHandCount: 3,
    isHardCourse: 1,
    finalScore: 56.05, // 41.05 + (3 * 5)
  },
]

// サンプルデータをデータベースに挿入
const insertStmt = db.prepare(`
  INSERT INTO scores (playerName, time, divineHandCount, isHardCourse, finalScore)
  VALUES (?, ?, ?, ?, ?)
`)

const insertMany = db.transaction((scores) => {
  for (const score of scores) {
    insertStmt.run(score.playerName, score.time, score.divineHandCount, score.isHardCourse, score.finalScore)
  }
})

insertMany(sampleScores)
console.log(`${sampleScores.length}件のサンプルデータを挿入しました`)

// 確認のためにデータを取得して表示
const scores = db.prepare("SELECT * FROM scores").all()
console.log("挿入されたデータ:")
console.table(scores)

console.log("データベースの初期化が完了しました")
db.close()
