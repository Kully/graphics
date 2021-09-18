/* Helper Functions */


export function insideEnemy(pos_x, pos_y, enemy)
{
    for(let i=enemy["x"]; i<enemy["x"]+enemy["w"]; i++)
        for(let j=enemy["y"]; j<enemy["y"]+enemy["h"]; j++)
        {
            if(pos_x === i && pos_y === j)
            {
                return true;
            }
        }
    return false;
}
