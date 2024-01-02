import { CONTROLLER, KEYDOWN_COUNTER } from "./state.js"


export function keydownHandler(e)
{
    if(e.code === "KeyA")  { CONTROLLER["KeyA"] = 1; }
    if(e.code === "KeyD") { CONTROLLER["KeyD"] = 1; }
    if(e.code === "KeyW")       { CONTROLLER["KeyW"] = 1; }
    if(e.code === "KeyS")  { CONTROLLER["KeyS"] = 1; }
    if(e.code === "KeyI")       { CONTROLLER["KeyI"] = 1; }
    if(e.code === "KeyP")       { CONTROLLER["KeyP"] = 1; }
}

export function keyupHandler(e)
{
    if(e.code === "KeyA")  { CONTROLLER["KeyA"] = 0; }
    if(e.code === "KeyD") { CONTROLLER["KeyD"] = 0; }
    if(e.code === "KeyW")       { CONTROLLER["KeyW"] = 0; }
    if(e.code === "KeyS")  { CONTROLLER["KeyS"] = 0; }
    if(e.code === "KeyI")       { CONTROLLER["KeyI"] = 0; }
    if(e.code === "KeyP")       { CONTROLLER["KeyP"] = 0; }
}
