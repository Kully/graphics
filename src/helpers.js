/* Helper Functions Module */


export function insideObject(pos_x, pos_y, object)
{
    for(let i=object["x"]; i<object["x"]+object["w"]; i++)
        for(let j=object["y"]; j<object["y"]+object["h"]; j++)
        {
            if(pos_x === i && pos_y === j)
            {
                return true;
            }
        }
    return false;
}


export function euclideanNorm(x, y)
{
    return Math.sqrt(x**2 + y**2)
}


export function distance(x0, y0, x1, y1)
{
    let x_delta = x1 - x0;
    let y_delta = y1 - y0;
    return euclideanNorm(x_delta, y_delta);
}


export function objectCenter(object)
{
    return {
        x: object["x"] + parseInt(object["w"] / 2),
        y: object["y"] + parseInt(object["h"] / 2),
    }
}
