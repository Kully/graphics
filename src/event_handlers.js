import { CONTROLLER } from "./state.js"


export function keydownHandler(e)
{
    if(e.code === "ArrowLeft")  { CONTROLLER["ArrowLeft"] = 1; }
    if(e.code === "ArrowRight") { CONTROLLER["ArrowRight"] = 1; }
    if(e.code === "ArrowUp")    { CONTROLLER["ArrowUp"] = 1; }
    if(e.code === "ArrowDown")  { CONTROLLER["ArrowDown"] = 1; }
    if(e.code === "KeyA")       { CONTROLLER["KeyA"] = 1; }
    if(e.code === "KeyD")       { CONTROLLER["KeyD"] = 1; }
}

export function keyupHandler(e)
{
    if(e.code === "ArrowLeft")  { CONTROLLER["ArrowLeft"] = 0; }
    if(e.code === "ArrowRight") { CONTROLLER["ArrowRight"] = 0; }
    if(e.code === "ArrowUp")    { CONTROLLER["ArrowUp"] = 0; }
    if(e.code === "ArrowDown")  { CONTROLLER["ArrowDown"] = 0; }
    if(e.code === "KeyA")       { CONTROLLER["KeyA"] = 0; }
    if(e.code === "KeyD")       { CONTROLLER["KeyD"] = 0; }
}
