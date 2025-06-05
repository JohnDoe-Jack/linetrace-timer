"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { addScore, updateScore } from "@/lib/actions"
import type { ScoreType } from "@/lib/types"

interface ScoreFormProps {
  editingScore?: ScoreType | null
  onComplete: () => void
}

export function ScoreForm({ editingScore, onComplete }: ScoreFormProps) {
  const [playerName, setPlayerName] = useState("")
  const [time, setTime] = useState("")
  const [divineHandCount, setDivineHandCount] = useState("0")
  const [courseLevel, setCourseLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('advanced')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 編集モードの場合、フォームに値をセット
  useEffect(() => {
    if (editingScore) {
      setPlayerName(editingScore.playerName)
      setTime(editingScore.time.toString())
      setDivineHandCount(editingScore.divineHandCount.toString())
      setCourseLevel(editingScore.courseLevel)
    } else {
      // 新規作成モードではフォームをリセット
      setPlayerName("")
      setTime("")
      setDivineHandCount("0")
      setCourseLevel('advanced')
    }
  }, [editingScore])

  // スコア計算（修正版）
  const calculateFinalScore = (time: number, divineHandCount: number, courseLevel: 'beginner' | 'intermediate' | 'advanced') => {
    // 神の手による加算（1回につき+5秒）
    const divineHandPenalty = divineHandCount * 5

    // コース難易度による加算
    const coursePenalty = courseLevel === 'beginner' ? 30 : courseLevel === 'intermediate' ? 10 : 0

    // 最終スコア = タイム + 神の手ペナルティ + コース難易度ペナルティ
    return time + divineHandPenalty + coursePenalty
  }

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!playerName || !time) return

    setIsSubmitting(true)

    try {
      const timeValue = Number.parseFloat(time)
      const divineHandValue = Number.parseInt(divineHandCount)
      const finalScore = calculateFinalScore(timeValue, divineHandValue, courseLevel)

      const scoreData = {
        playerName,
        time: timeValue,
        divineHandCount: divineHandValue,
        courseLevel,
        finalScore,
      }

      if (editingScore) {
        // 既存スコアの更新
        await updateScore(editingScore.id, scoreData)
      } else {
        // 新規スコアの追加
        await addScore(scoreData)
      }

      // フォームリセットと完了通知
      setPlayerName("")
      setTime("")
      setDivineHandCount("0")
      setCourseLevel('advanced')
      onComplete()
    } catch (error) {
      console.error("スコア保存エラー:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="playerName">選手名</Label>
        <Input
          id="playerName"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="選手名を入力"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">タイム (秒)</Label>
        <Input
          id="time"
          type="number"
          step="0.01"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="タイムを入力 (例: 45.67)"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="divineHandCount">神の手使用回数</Label>
        <Input
          id="divineHandCount"
          type="number"
          min="0"
          value={divineHandCount}
          onChange={(e) => setDivineHandCount(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">1回につき+5秒のペナルティ</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="courseLevel">コース難易度</Label>
        <Select value={courseLevel} onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setCourseLevel(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">初級 (+30秒)</SelectItem>
            <SelectItem value="intermediate">中級 (+10秒)</SelectItem>
            <SelectItem value="advanced">上級 (+0秒)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 計算されるスコアのプレビュー表示 */}
      {time && (
        <div className="p-4 bg-muted rounded-md">
          <p className="font-medium">計算されるスコア:</p>
          <p className="text-xl font-bold">
            {calculateFinalScore(
              Number.parseFloat(time) || 0,
              Number.parseInt(divineHandCount) || 0,
              courseLevel,
            ).toFixed(2)}
            秒
          </p>
          <p className="text-sm text-muted-foreground">
            タイム: {Number.parseFloat(time) || 0}秒 + 神の手: {(Number.parseInt(divineHandCount) || 0) * 5}秒 + コース: {
              courseLevel === 'beginner' ? 30 : courseLevel === 'intermediate' ? 10 : 0
            }秒
          </p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "保存中..." : editingScore ? "スコアを更新" : "スコアを登録"}
      </Button>
    </form>
  )
}