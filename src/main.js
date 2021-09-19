"use strict";

import {
    WIDTH,
    HEIGHT,
    FPS,
    COLOR_WHITE,
    COLOR_FLOOR,
    COLOR_PLAYER,
    TWO_PI,
    VISION_SPREAD,
    ROTATE_ANGLE,
    DRAW_DISTANCE,
    EVENT_CODES,
    FRAME_VELO_LOOKUP,
    BIG_NUMBER,
} from "./constants.js";

import {
    keydownHandler,
    keyupHandler
} from "./event_handlers.js"

import {
    insideObject,
    distance,
    objectCenter,
} from "./helpers.js";

import {
    CONTROLLER,
    KEYDOWN_COUNTER,
    PLAYER,
} from "./state.js"


const LEVEL_OBJECTS = [
    {
        x: WIDTH/2 + 20,
        y: HEIGHT/2 - 35,
        z: 300,
        w: 20,
        h: 20,
        color: "#548CA8",
    },
    {
        x: WIDTH/2 + 50,
        y: HEIGHT/2 - 35,
        z: 400,
        w: 20,
        h: 20,
        color: "#5F8CD8",
    },
];


const EVENTCODE_CHAR_LOOKUP = {
    ArrowLeft: "←",
    ArrowRight: "→",
    ArrowUp: "↑",
    ArrowDown: "↓",
    KeyA: "A",
    KeyD: "D",
}


let canvas = document.getElementById("my-canvas");
let ctx = canvas.getContext("2d");

let canvas2 = document.getElementById("my-canvas-2");
let ctx2 = canvas2.getContext("2d");


function clearScreen(context, color)
{
    context.fillStyle = color;
    context.fillRect(0, 0, WIDTH, HEIGHT);
}


function drawCanvas2(context)
{
    context.fillStyle = COLOR_WHITE;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    context.fillStyle = PLAYER["color"];
    context.fillRect(PLAYER["x"], PLAYER["y"], PLAYER["w"], PLAYER["h"]);

    for(let obj of LEVEL_OBJECTS)
    {
        context.fillStyle = obj["color"];
        context.fillRect(obj["x"], obj["y"], obj["w"], obj["h"]);
    }
}


function veloLookup(n)
{
    return FRAME_VELO_LOOKUP[n];
}


function movePlayer()
{
    // move left
    let x_velo_l = veloLookup(KEYDOWN_COUNTER["ArrowLeft"]);
    PLAYER["x"] -= x_velo_l * Math.cos(PLAYER["angle"] + VISION_SPREAD);
    PLAYER["y"] -= x_velo_l * Math.sin(PLAYER["angle"] + VISION_SPREAD);

    // move right
    let x_velo_r = veloLookup(KEYDOWN_COUNTER["ArrowRight"]);
    PLAYER["x"] += x_velo_r * Math.cos(PLAYER["angle"] + VISION_SPREAD);
    PLAYER["y"] += x_velo_r * Math.sin(PLAYER["angle"] + VISION_SPREAD);


    // move forwards
    let x_velo_u = veloLookup(KEYDOWN_COUNTER["ArrowUp"]);
    PLAYER["x"] += x_velo_u * Math.cos(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);
    PLAYER["y"] += x_velo_u * Math.sin(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);
    
    // move backwards
    let x_velo_d = veloLookup(KEYDOWN_COUNTER["ArrowDown"]);
    PLAYER["x"] -= x_velo_d * Math.cos(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);
    PLAYER["y"] -= x_velo_d * Math.sin(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);
}


function rotatePlayer()
{
    // counter-clockwise
    let x_velo_keya = veloLookup(KEYDOWN_COUNTER["KeyA"]);
    PLAYER["angle"] -= x_velo_keya * ROTATE_ANGLE;
    PLAYER["angle"] %= (TWO_PI);

    // clockwise
    let x_velo_keyd = veloLookup(KEYDOWN_COUNTER["KeyD"]);
    PLAYER["angle"] += x_velo_keyd * ROTATE_ANGLE;
    PLAYER["angle"] %= (TWO_PI);
}

document.addEventListener("keydown", keydownHandler)
document.addEventListener("keyup", keyupHandler)

function gameLoop(e)
{
    let max_frame = 5
    for(let code of EVENT_CODES)
    {
        if(CONTROLLER[code] === 1)
            KEYDOWN_COUNTER[code] = Math.min(max_frame, KEYDOWN_COUNTER[code] + 1);
        else
            KEYDOWN_COUNTER[code] = Math.max(0, KEYDOWN_COUNTER[code] - 1);
    }

    movePlayer();
    rotatePlayer();

    clearScreen(ctx, COLOR_WHITE);
    ctx.fillStyle = COLOR_FLOOR;
    ctx.fillRect(0, HEIGHT/2, WIDTH, HEIGHT / 2);
    let x = 0;
    let objectPtr = 0;
    for(
        let angle = PLAYER["angle"] - VISION_SPREAD / 2;
            angle < PLAYER["angle"] + VISION_SPREAD / 2;
                angle += (VISION_SPREAD) / WIDTH
    )
    {
        let depthReached = BIG_NUMBER;
        let d = 0;
        while(d < DRAW_DISTANCE && depthReached === BIG_NUMBER)
        {
            let vector = [
                PLAYER["x"] + ( Math.cos(angle) ) * d,
                PLAYER["y"] + ( Math.sin(angle) ) * d
            ]

            vector[0] = parseInt(vector[0]);
            vector[1] = parseInt(vector[1]);

            for(let obj_idx in LEVEL_OBJECTS)
            {
                if(insideObject(vector[0], vector[1], LEVEL_OBJECTS[obj_idx]))
                {
                    depthReached = Math.min(d, depthReached);
                    objectPtr = obj_idx;
                }
            }
            d += 1;
        }
        x += 1;
        ctx.fillStyle = LEVEL_OBJECTS[objectPtr]["color"];
        let h = LEVEL_OBJECTS[0]["z"] / depthReached * (HEIGHT / DRAW_DISTANCE);
        let y_pos = (HEIGHT - h) / 2;
        ctx.fillRect(x, y_pos, 1, h);
    }

    drawCanvas2(ctx2);
}


setInterval(gameLoop, 1000 / FPS);
