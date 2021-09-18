"use strict";

import {
    WIDTH,
    HEIGHT,
    FPS,
    COLOR_WHITE,
    COLOR_FLOOR,
    COLOR_BLOCK,
    COLOR_PLAYER,
    TWO_PI,
    VISION_SPREAD,
    ROTATE_ANGLE,
    DRAW_DISTANCE,
    EVENT_CODES,
    FRAME_VELO_LOOKUP,
} from "./constants.js";

import {
    keydownHandler,
    keyupHandler
} from "./event_handlers.js"

import {
    insideObject,
} from "./helpers.js";

import {
    CONTROLLER,
    KEYDOWN_COUNTER,
    PLAYER,
    BLOCK,
} from "./state.js"


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


let keypressDisplay = document.getElementById("keypress-display");


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

function drawBlock_2()
{
    for(let en of [BLOCK])
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

function lookupVelocity(n)
{
    return FRAME_VELO_LOOKUP[n];
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


document.addEventListener("keydown", keydownHandler)

document.addEventListener("keyup", keyupHandler)

function gameLoop(e)
{
    let max_frame = 5
    keypressDisplay.innerHTML = "";
    for(let code of EVENT_CODES)
    {
        if(CONTROLLER[code] === 1)
        {
            KEYDOWN_COUNTER[code] = Math.min(
                max_frame,
                KEYDOWN_COUNTER[code] + 1
            );

            // display keys down in front-end
            keypressDisplay.innerHTML += EVENTCODE_CHAR_LOOKUP[code];
            keypressDisplay.innerHTML += " ";
        }
        else
        {
            KEYDOWN_COUNTER[code] = Math.max(
                0,
                KEYDOWN_COUNTER[code] - 1
            );
        }
    }

    // move player left
    let x_velo_l = lookupVelocity(KEYDOWN_COUNTER["ArrowLeft"]);
    PLAYER["x"] -= x_velo_l * Math.cos(PLAYER["angle"] + VISION_SPREAD);
    PLAYER["y"] -= x_velo_l * Math.sin(PLAYER["angle"] + VISION_SPREAD);

    // move player right
    let x_velo_r = lookupVelocity(KEYDOWN_COUNTER["ArrowRight"]);
    PLAYER["x"] += x_velo_r * Math.cos(PLAYER["angle"] + VISION_SPREAD);
    PLAYER["y"] += x_velo_r * Math.sin(PLAYER["angle"] + VISION_SPREAD);


    // move player up
    let x_velo_u = lookupVelocity(KEYDOWN_COUNTER["ArrowUp"]);
    PLAYER["x"] += x_velo_u * Math.cos(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);
    PLAYER["y"] += x_velo_u * Math.sin(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);
    
    // move player down
    let x_velo_d = lookupVelocity(KEYDOWN_COUNTER["ArrowDown"]);
    PLAYER["x"] -= x_velo_d * Math.cos(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);
    PLAYER["y"] -= x_velo_d * Math.sin(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);

    // rotate player ccw
    let x_velo_keya = lookupVelocity(KEYDOWN_COUNTER["KeyA"]);
    PLAYER["angle"] -= x_velo_keya * ROTATE_ANGLE;
    PLAYER["angle"] %= (TWO_PI);

    // rotate player cw
    let x_velo_keyd = lookupVelocity(KEYDOWN_COUNTER["KeyD"]);
    PLAYER["angle"] += x_velo_keyd * ROTATE_ANGLE;
    PLAYER["angle"] %= (TWO_PI);


    // Calculate the heights of blocks around the player
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

            if(insideObject(pos_vector[0], pos_vector[1], BLOCK))
            {
                depthReached = Math.min(d, depthReached);
            }
        }
        rel_heights.push(depthReached);
    }

    clearScreen();
    ctx.fillStyle = COLOR_FLOOR;
    ctx.fillRect(0, HEIGHT/2, WIDTH, HEIGHT / 2);

    ctx.fillStyle = BLOCK["color"];
    for(let x=0; x<WIDTH; x+=1)
    {
        let h = BLOCK["z"] / rel_heights[x] * (HEIGHT / DRAW_DISTANCE);
        let y_pos = (HEIGHT - h) / 2;
        ctx.fillRect(x, y_pos, 1, h);
    }

    // draw bird's eye view
    clearScreen_2();
    drawPlayer_2();
    drawBlock_2();
}


setInterval(gameLoop, 1000 / FPS);
