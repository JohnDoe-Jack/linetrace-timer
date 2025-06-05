import React from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ScoreType } from "@/lib/types"

interface ScoreboardDisplayProps {
  scores: ScoreType[]
  actions?: React.ReactNode
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
            scores.map((score) => (
              <TableRow key={score.id}>
                <TableCell className="font-medium">{score.playerName}</TableCell>
                <TableCell className="text-right font-bold">{score.finalScore.toFixed(2)}秒</TableCell>
                <TableCell className="text-right">{score.time.toFixed(2)}秒</TableCell>
                <TableCell className="text-center">{score.divineHandCount}回</TableCell>
                <TableCell>
                  <Badge variant={score.isHardCourse ? "default" : "outline"}>{score.isHardCourse ? "難" : "易"}</Badge>
                </TableCell>
                {actions && (
                  <TableCell className="text-right">
                    {React.cloneElement(actions as React.ReactElement, { score })}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
