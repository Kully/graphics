/* State Module */

import {
    WIDTH,
    HEIGHT,
    COLOR_PLAYER,
    COLOR_BLOCK,
} from "./constants.js";


export const CONTROLLER = {
    KeyS: 0,
    KeyA: 0,
    KeyD: 0,
    KeyI: 0,
    KeyP: 0,
    KeyW: 0,
};
export const KEYDOWN_COUNTER = {
    KeyS: 0,
    KeyA: 0,
    KeyD: 0,
    KeyI: 0,
    KeyP: 0,
    KeyW: 0,
};
export const PLAYER = {
    x: WIDTH/2+10,
    y: HEIGHT/2,
    w: 10,
    h: 10,
    color: COLOR_PLAYER,
    angle: 0,
};
