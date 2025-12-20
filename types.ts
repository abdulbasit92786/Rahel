
export type Point = {
  x: number;
  y: number;
};

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export enum GameState {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER'
}

export interface Snack {
  id: string;
  position: Point;
  type: string;
  color: string;
  points: number;
}

export interface GameCommentary {
  text: string;
  mood: 'encouraging' | 'funny' | 'dramatic' | 'warm';
}
