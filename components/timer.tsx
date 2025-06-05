"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function Timer() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // タイマーの開始/停止
  const toggleTimer = () => {
    if (isRunning) {
      // タイマー停止
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    } else {
      // タイマー開始
      const startTime = Date.now() - time
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime)
      }, 10)
    }
    setIsRunning(!isRunning)
  }

  // ラップタイム記録
  const recordLap = () => {
    // 最大2回までラップを記録
    if (laps.length < 2) {
      setLaps([...laps, time])
    }
  }

  // タイマーリセット
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setTime(0)
    setIsRunning(false)
    setLaps([])
  }

  // コンポーネントのアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // 時間のフォーマット (mm:ss.ms)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    const milliseconds = Math.floor((time % 1000) / 10)

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* タイマー表示 */}
      <div className="text-6xl font-mono font-bold tabular-nums">{formatTime(time)}</div>

      {/* コントロールボタン */}
      <div className="flex gap-4">
        <Button onClick={toggleTimer} variant={isRunning ? "destructive" : "default"} size="lg">
          {isRunning ? "停止" : "開始"}
        </Button>

        <Button onClick={recordLap} disabled={!isRunning || laps.length >= 2} variant="outline" size="lg">
          ラップ ({laps.length}/2)
        </Button>

        <Button onClick={resetTimer} variant="secondary" size="lg">
          リセット
        </Button>
      </div>

      {/* ラップタイム表示 */}
      {laps.length > 0 && (
        <Card className="w-full p-4 mt-4">
          <h3 className="text-lg font-bold mb-2">記録したタイム:</h3>
          <ul className="space-y-2">
            {laps.map((lap, index) => (
              <li key={index} className="font-mono text-xl">
                走行 {index + 1}: {formatTime(lap)}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
