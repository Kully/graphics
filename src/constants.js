/* Constants Module */

// screen and fps
export const WIDTH = 600;
export const HEIGHT = 400;
export const FPS = 60;
export const BIG_NUMBER = 10000000;

// colors
export const COLOR_WHITE = "#EEEEEE";
export const COLOR_FLOOR = "#4B3869";
export const COLOR_BLOCK = "#548CA8";
export const COLOR_PLAYER = "#D54C4C";

// constants for drawing algo
export const TWO_PI = 2 * Math.PI;
export const VISION_SPREAD = Math.PI/2;
export const ROTATE_ANGLE = Math.PI/32;
export const DRAW_DISTANCE = 80;

export const EVENT_CODES = [
    "KeyA",
    "KeyD",
    "KeyS",
    "KeyI",
    "KeyP",
    "KeyW",
];

// this only supports a max of 6 frames
export const FRAME_VELO_LOOKUP = {
    0: 0,
    1: 0.24,
    2: 0.4,
    3: 0.6,
    4: 0.8,
    5: 1,
}
