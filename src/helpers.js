/* Helper Functions Module */


export function insideEnemy(pos_x, pos_y, BLOCK)
{
    for(let i=BLOCK["x"]; i<BLOCK["x"]+BLOCK["w"]; i++)
        for(let j=BLOCK["y"]; j<BLOCK["y"]+BLOCK["h"]; j++)
        {
            if(pos_x === i && pos_y === j)
            {
                return true;
            }
        }
    return false;
}
