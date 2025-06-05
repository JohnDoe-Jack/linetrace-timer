import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">ライントレース大会 タイマー＆スコアボードシステム</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <Link href="/timer" className="w-full">
          <Button variant="outline" className="w-full h-32 text-xl">
            タイマー表示端末
          </Button>
        </Link>

        <Link href="/scoreboard" className="w-full">
          <Button variant="outline" className="w-full h-32 text-xl">
            スコア記録端末
          </Button>
        </Link>
      </div>
    </div>
  )
}
