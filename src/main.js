"use strict";

import {
    WIDTH,
    HEIGHT,
    FPS,
    COLOR_WHITE,
    COLOR_FLOOR,
    COLOR_WALL,
    TWO_PI,
    VISION_SPREAD,
    ROTATE_ANGLE,
    DRAW_DISTANCE,
    EVENT_CODES,
} from "./constants.js";

import { insideEnemy } from "./helpers.js";

let canvas = document.getElementById("my-canvas");
let ctx = canvas.getContext("2d");

let canvas2 = document.getElementById("my-canvas-2");
let ctx2 = canvas2.getContext("2d");

const CONTROLLER = {
    ArrowDown: 0,
    ArrowUp: 0,
    ArrowLeft: 0,
    ArrowRight: 0,
    KeyA: 0,
    KeyD: 0,
}
const INPUT_TIMER = {
    ArrowDown: 0,
    ArrowUp: 0,
    ArrowLeft: 0,
    ArrowRight: 0,
    KeyA: 0,
    KeyD: 0,
}
const PLAYER = {
    x: WIDTH/2+10,
    y: HEIGHT/2,
    w: 10,
    h: 10,
    color: "#D54C4C",
    angle: 0,
};
let enemy = {
    x: WIDTH/2 + 20,
    y: HEIGHT/2 - 35,
    z: 300,
    w: 20,
    h: 20,
};

function clearScreen()
{
    ctx.fillStyle = COLOR_WHITE;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function clearScreen_2()
{
    ctx2.fillStyle = COLOR_WHITE;
    ctx2.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawPlayer_2()
{
    ctx2.fillStyle = PLAYER["color"];
    ctx2.fillRect(PLAYER["x"], PLAYER["y"], PLAYER["w"], PLAYER["h"]);
}

function drawEnemy_2()
{
    for(let en of [enemy])
    {
        ctx2.fillStyle = en["color"];
        ctx2.fillRect(
            en["x"],
            en["y"],
            en["w"],
            en["h"]
        );
    }
}

function movePlayer()
{
    if(CONTROLLER["ArrowLeft"] === 1)
    {
        PLAYER["x"] -= Math.cos(PLAYER["angle"] + VISION_SPREAD);
        PLAYER["y"] -= Math.sin(PLAYER["angle"] + VISION_SPREAD);
    }
    if(CONTROLLER["ArrowRight"] === 1)
    {
        PLAYER["x"] += Math.cos(PLAYER["angle"] + VISION_SPREAD);
        PLAYER["y"] += Math.sin(PLAYER["angle"] + VISION_SPREAD);
    }
    if(CONTROLLER["ArrowUp"] === 1)
    {
        PLAYER["x"] += Math.cos(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);
        PLAYER["y"] += Math.sin(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);
    }
    if(CONTROLLER["ArrowDown"] === 1)
    {
        PLAYER["x"] -= Math.cos(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);
        PLAYER["y"] -= Math.sin(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);
    }
}

function rotatePlayer()
{
    if(CONTROLLER["KeyA"] === 1)
    {
        PLAYER["angle"] -= ROTATE_ANGLE;
        PLAYER["angle"] %= (TWO_PI);
    }
    if(CONTROLLER["KeyD"] === 1)
    {
        PLAYER["angle"] += ROTATE_ANGLE;
        PLAYER["angle"] %= (TWO_PI);
    }
}


document.addEventListener("keydown", function(e) {
    if(e.code === "ArrowLeft")  { CONTROLLER["ArrowLeft"] = 1; }
    if(e.code === "ArrowRight") { CONTROLLER["ArrowRight"] = 1; }
    if(e.code === "ArrowUp")    { CONTROLLER["ArrowUp"] = 1; }
    if(e.code === "ArrowDown")  { CONTROLLER["ArrowDown"] = 1; }
    if(e.code === "KeyA")       { CONTROLLER["KeyA"] = 1; }
    if(e.code === "KeyD")       { CONTROLLER["KeyD"] = 1; }
})

document.addEventListener("keyup", function(e) {
    if(e.code === "ArrowLeft")  { CONTROLLER["ArrowLeft"] = 0; }
    if(e.code === "ArrowRight") { CONTROLLER["ArrowRight"] = 0; }
    if(e.code === "ArrowUp")    { CONTROLLER["ArrowUp"] = 0; }
    if(e.code === "ArrowDown")  { CONTROLLER["ArrowDown"] = 0; }
    if(e.code === "KeyA")       { CONTROLLER["KeyA"] = 0; }
    if(e.code === "KeyD")       { CONTROLLER["KeyD"] = 0; }
})

setInterval(function(e) {
    // function: count how long each controller button is held down
    for(let code of EVENT_CODES)
    {
        if(CONTROLLER[code] === 1)
        {
            INPUT_TIMER[code] += 1;
        }
        else
        {
            INPUT_TIMER[code] = 0;
        }
    }

    movePlayer();
    rotatePlayer();

    // Figure out what the POV should look like
    let angle_incr = (VISION_SPREAD) / WIDTH;
    let rel_heights = [];
    for(
        let angle = PLAYER["angle"] - VISION_SPREAD / 2;
        angle < PLAYER["angle"] + VISION_SPREAD / 2;
        angle += angle_incr)
    {
        let depthReached = 10000000;
        for(let d=0; d<DRAW_DISTANCE; d++)
        {
            let pos_vector = [
                PLAYER["x"] + ( Math.cos(angle) ) * d,
                PLAYER["y"] + ( Math.sin(angle) ) * d
            ]

            pos_vector[0] = parseInt(pos_vector[0]);
            pos_vector[1] = parseInt(pos_vector[1]);

            if(insideEnemy(pos_vector[0], pos_vector[1], enemy))
            {
                depthReached = Math.min(d, depthReached);
            }
        }
        rel_heights.push(depthReached);
    }

    clearScreen();
    ctx.fillStyle = COLOR_FLOOR
    ctx.fillRect(0, HEIGHT/2, WIDTH, HEIGHT / 2);

    ctx.fillStyle = COLOR_WALL;
    for(let k=0; k<WIDTH; k+=1)
    {
        let enemyHeight = enemy["z"] / rel_heights[k] * (HEIGHT / DRAW_DISTANCE);
        let y_pos = (HEIGHT - enemyHeight) / 2
        ctx.fillRect(k, y_pos, 1, enemyHeight);
    }

    // draw bird's eye view for debugging
    clearScreen_2();
    drawPlayer_2();
    drawEnemy_2();
}, 1000 / FPS)
