const processor = require('../09/processor');

const directionToXY = {
    0: {
        x: 0,
        y: -1,
    },
    1: {
        x: 1,
        y: 0,
    },
    2: {
        x: 0,
        y: 1,
    },
    3: {
        x: -1,
        y: 0,
    },
};

const w = 50;
const h = 2;

module.exports = async program => {
    let direction = 0;
    let x = w / 2;
    let y = h / 2;
    let outputCount = 0;
    const map = [];
    map[y] = new Array(w);
    map[y].fill(undefined, 0, w);
    map[y][x] = 1;
    let painted = 1;
    await processor(
        program,
        () => {
            return (map[y] && map[y][x]) || 0;
        },
        output => {
            if (outputCount++ % 2 === 0) {
                if (!map[y]) {
                    map[y] = new Array(w);
                    map[y].fill(undefined, 0, w);
                }
                if (map[y][x] === undefined) {
                    painted++;
                }
                map[y][x] = output;
            } else {
                if (output === 0) {
                    direction--;
                    if (direction === -1) {
                        direction = 3;
                    }
                } else if (output === 1) {
                    direction++;
                    if (direction === 4) {
                        direction = 0;
                    }
                }
                const { x: deltaX, y: deltaY } = directionToXY[direction];
                x += deltaX;
                y += deltaY;
            }
        }
    );

    let printed = '\n';
    for (y = 0; y < map.length; y++) {
        if (map[y]) {
            printed += map[y]
                .map(char => (char === undefined || char === 0 ? ' ' : '█'))
                .join('');
        }
        printed += '\n';
    }

    return { painted, printed };
};
