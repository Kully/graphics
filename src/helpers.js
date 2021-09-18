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
