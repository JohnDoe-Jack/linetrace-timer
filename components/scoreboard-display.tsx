import React from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ScoreType } from "@/lib/types"

interface ScoreboardDisplayProps {
  scores: ScoreType[]
  actions?: React.ReactElement<{ score: ScoreType }>
}

// コース難易度のラベルとバリアントを取得
function getCourseBadge(courseLevel: 'beginner' | 'intermediate' | 'advanced') {
  switch (courseLevel) {
    case 'beginner':
      return { label: '初級', variant: 'outline' as const }
    case 'intermediate':
      return { label: '中級', variant: 'secondary' as const }
    case 'advanced':
      return { label: '上級', variant: 'default' as const }
  }
}

export function ScoreboardDisplay({ scores, actions }: ScoreboardDisplayProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名前</TableHead>
            <TableHead className="text-right">スコア</TableHead>
            <TableHead className="text-right">タイム</TableHead>
            <TableHead className="text-center">神の手</TableHead>
            <TableHead>コース</TableHead>
            {actions && <TableHead className="text-right">操作</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={actions ? 6 : 5} className="text-center py-4">
                記録がありません
              </TableCell>
            </TableRow>
          ) : (
            scores.map((score) => {
              const courseBadge = getCourseBadge(score.courseLevel)
              return (
                <TableRow key={score.id}>
                  <TableCell className="font-medium">{score.playerName}</TableCell>
                  <TableCell className="text-right font-bold">{score.finalScore.toFixed(2)}秒</TableCell>
                  <TableCell className="text-right">{score.time.toFixed(2)}秒</TableCell>
                  <TableCell className="text-center">{score.divineHandCount}回</TableCell>
                  <TableCell>
                    <Badge variant={courseBadge.variant}>{courseBadge.label}</Badge>
                  </TableCell>
                  {actions && (
                    <TableCell className="text-right">
                      {React.cloneElement(actions as React.ReactElement<{ score: ScoreType }>, { score })}
                    </TableCell>
                  )}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}