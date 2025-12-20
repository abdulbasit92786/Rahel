
import { Point } from "./types";

export const GRID_SIZE = 20;
export const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = "UP";
export const TICK_RATE = 150;

// Update property from 'name' to 'type' to match the Snack interface
export const SNACK_TYPES = [
  { type: "Golden Apple", color: "bg-yellow-400", points: 10 },
  { type: "Warm Cookie", color: "bg-orange-800", points: 15 },
  { type: "Spiced Latte", color: "bg-amber-600", points: 20 },
  { type: "Honey Glazed Pear", color: "bg-orange-400", points: 25 },
  { type: "Roasted Chestnut", color: "bg-stone-600", points: 30 },
];
