/* State Module */

import {
    WIDTH,
    HEIGHT,
    COLOR_PLAYER,
    COLOR_BLOCK,
} from "./constants.js";


export const CONTROLLER = {
    ArrowDown: 0,
    ArrowUp: 0,
    ArrowLeft: 0,
    ArrowRight: 0,
    KeyA: 0,
    KeyD: 0,
};
export const KEYDOWN_COUNTER = {
    ArrowDown: 0,
    ArrowUp: 0,
    ArrowLeft: 0,
    ArrowRight: 0,
    KeyA: 0,
    KeyD: 0,
};
export const PLAYER = {
    x: WIDTH/2+10,
    y: HEIGHT/2,
    w: 10,
    h: 10,
    color: COLOR_PLAYER,
    angle: 0,
};
export const BLOCK = {
    x: WIDTH/2 + 20,
    y: HEIGHT/2 - 35,
    z: 300,
    w: 20,
    h: 20,
    color: COLOR_BLOCK,
};
