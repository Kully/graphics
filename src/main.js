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
    INPUT_TIMER,
    PLAYER,
    BLOCK,
} from "./state.js"


let canvas = document.getElementById("my-canvas");
let ctx = canvas.getContext("2d");

let canvas2 = document.getElementById("my-canvas-2");
let ctx2 = canvas2.getContext("2d");


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

function acc_frac(n)
{
    if(n === 0)
        return 0;
    if(n <= 4)
        return 0.2;
    if(n <= 8)
        return 0.5;
    if(n <= 12)
        return 0.6;
    if(n <= 14)
        return 0.8;
    else
        return 1;
}


function acc_frac_2(n)
{
    let new_n = Math.min(n, 9);
    console.log("new_n is ", new_n);

    let acceleration_lookup = {
        0: 0,
        1: 0.1,
        2: 0.15,
        3: 0.2,
        4: 0.29,
        5: 0.44,
        6: 0.56,
        7: 0.62,
        8: 0.77,
        9: 0.89,
        10: 1,
    }
    return acceleration_lookup[new_n];
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


document.addEventListener(
    "keydown", keydownHandler
)

document.addEventListener(
    "keyup", keyupHandler
)

function gameLoop(e)
{
    // acceleration
    let max_frame = 20
    for(let code of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyA", "KeyD"])
    {
        if(CONTROLLER[code] === 1)
        {
            INPUT_TIMER[code] = Math.min(
                max_frame,
                INPUT_TIMER[code] + 1
            );
        }
        else
        {
            INPUT_TIMER[code] = Math.max(
                0,
                INPUT_TIMER[code] - 1
            );
        }
    }


    // Move player
    let x_velo_l = acc_frac(INPUT_TIMER["ArrowLeft"]);
    let x_velo_r = acc_frac(INPUT_TIMER["ArrowRight"]);
    PLAYER["x"] -= x_velo_l * Math.cos(PLAYER["angle"] + VISION_SPREAD);
    PLAYER["y"] -= x_velo_l * Math.sin(PLAYER["angle"] + VISION_SPREAD);

    PLAYER["x"] += x_velo_r * Math.cos(PLAYER["angle"] + VISION_SPREAD);
    PLAYER["y"] += x_velo_r * Math.sin(PLAYER["angle"] + VISION_SPREAD);


    let x_velo_u = acc_frac(INPUT_TIMER["ArrowUp"]);
    let x_velo_d = acc_frac(INPUT_TIMER["ArrowDown"]);
    PLAYER["x"] += x_velo_u * Math.cos(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);
    PLAYER["y"] += x_velo_u * Math.sin(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);
    
    PLAYER["x"] -= x_velo_d * Math.cos(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);
    PLAYER["y"] -= x_velo_d * Math.sin(PLAYER["angle"] + VISION_SPREAD - Math.PI / 2);



    // Rotate player
    let x_velo_keya = acc_frac_2(INPUT_TIMER["KeyA"]);
    let x_velo_keyd = acc_frac_2(INPUT_TIMER["KeyD"]);

    PLAYER["angle"] -= x_velo_keya * ROTATE_ANGLE;
    PLAYER["angle"] %= (TWO_PI);

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
