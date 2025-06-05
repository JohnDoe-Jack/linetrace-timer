"use client"

import { useState, useEffect } from "react"
import { ScoreForm } from "@/components/score-form"
import { ScoreboardDisplay } from "@/components/scoreboard-display"
import { ScoreActions } from "@/components/score-actions"
import { fetchScores } from "@/lib/actions"

export default function ScoreboardPage() {
  const [scores, setScores] = useState([])
  const [editingScore, setEditingScore] = useState(null)

  // スコアデータを取得
  const loadScores = async () => {
    const data = await fetchScores()
    setScores(data)
  }

  useEffect(() => {
    loadScores()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">スコア記録端末</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">{editingScore ? "スコア編集" : "新規スコア登録"}</h2>
          <ScoreForm
            editingScore={editingScore}
            onComplete={() => {
              loadScores()
              setEditingScore(null)
            }}
          />
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">スコアボード</h2>
          <ScoreboardDisplay
            scores={scores}
            actions={<ScoreActions onEdit={setEditingScore} onDelete={loadScores} />}
          />
        </div>
      </div>
    </div>
  )
}
