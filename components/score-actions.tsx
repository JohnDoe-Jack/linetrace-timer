"use client"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { deleteScore } from "@/lib/actions"
import type { ScoreType } from "@/lib/types"

interface ScoreActionsProps {
  score?: ScoreType
  onEdit: (score: ScoreType) => void
  onDelete: () => void
}

export function ScoreActions({ score, onEdit, onDelete }: ScoreActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // スコア削除処理
  const handleDelete = async () => {
    if (!score) return

    setIsDeleting(true)
    try {
      await deleteScore(score.id)
      onDelete()
    } catch (error) {
      console.error("スコア削除エラー:", error)
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  if (!score) return null

  return (
    <>
      <div className="flex space-x-2">
        <Button variant="outline" size="icon" onClick={() => onEdit(score)} title="編集">
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="text-destructive hover:text-destructive"
          title="削除"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* 削除確認ダイアログ */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>スコアを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              {score.playerName}のスコアを削除します。この操作は元に戻せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "削除中..." : "削除する"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
