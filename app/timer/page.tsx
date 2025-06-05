"use client"

import { useState, useEffect } from "react"
import { Timer } from "@/components/timer"
import { ScoreboardDisplay } from "@/components/scoreboard-display"
import { fetchScores } from "@/lib/actions"

export default function TimerPage() {
  const [scores, setScores] = useState([])

  // スコアデータを定期的に取得
  useEffect(() => {
    const loadScores = async () => {
      const data = await fetchScores()
      setScores(data)
    }

    loadScores()
    // 5秒ごとにスコアを更新
    const interval = setInterval(loadScores, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">タイマー表示端末</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">タイマー</h2>
          <Timer />
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">スコアボード</h2>
          <ScoreboardDisplay scores={scores} />
        </div>
      </div>
    </div>
  )
}
