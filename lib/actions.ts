"use server";

import {
  getAllScores,
  insertScore,
  updateScoreById,
  deleteScoreById,
} from "./db";
import type { ScoreInput } from "./types";

// スコア一覧を取得するサーバーアクション
export async function fetchScores() {
  return getAllScores();
}

// スコアを追加するサーバーアクション
export async function addScore(score: ScoreInput) {
  return insertScore(score);
}

// スコアを更新するサーバーアクション
export async function updateScore(id: number, score: ScoreInput) {
  return updateScoreById(id, score);
}

// スコアを削除するサーバーアクション
export async function deleteScore(id: number) {
  return deleteScoreById(id);
}

let timerStartTime: number | null = null;

// タイマーの開始
export async function startTimer(time: number) {
  timerStartTime = time;
}

// タイマーの停止
export async function stopTimer() {
  timerStartTime = null;
}

// タイマーの開始時間を取得
export async function getTimerStartTime() {
  return timerStartTime;
}
