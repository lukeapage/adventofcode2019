const input = `
..#.#
.#.##
##...
.#.#.
###..
`;

const bioDiversity = map => {
    let bioDiversity = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === '#') {
                const index = y * map[y].length + x;
                bioDiversity += Math.pow(2, index);
            }
        }
    }
    return bioDiversity;
};

const nextIteration = map => {
    const newMap = [];
    for (let y = 0; y < map.length; y++) {
        newMap[y] = [];
        for (let x = 0; x < map[y].length; x++) {
            const bugsAdj =
                (y > 0 && map[y - 1][x] === '#') +
                (x > 0 && map[y][x - 1] === '#') +
                (x < map[y].length - 1 && map[y][x + 1] === '#') +
                (y < map.length - 1 && map[y + 1][x] === '#');
            if (map[y][x] === '#' && bugsAdj !== 1) {
                // bug dies
                newMap[y][x] = '.';
            } else if (map[y][x] === '.' && bugsAdj >= 1 && bugsAdj <= 2) {
                // bug created
                newMap[y][x] = '#';
            } else {
                newMap[y][x] = map[y][x];
            }
        }
    }
    return newMap;
};

const initialDimensionSpace = `
.....
.....
..?..
.....
.....
`;

const input2 = `
..#.#
.#.##
##?..
.#.#.
###..
`;

const strToMap = str => {
    return str
        .trim()
        .split('\n')
        .map(line => line.trim().split(''));
};

const getBugs = (maps, d, x, y, dx, dy) => {
    x = x + dx;
    y = y + dy;
    if (x < 0) {
        if (d === 0) {
            return 0;
        }
        return maps[d - 1][2][1] === '#';
    }
    if (x >= maps[0][0].length) {
        if (d === 0) {
            return 0;
        }
        return maps[d - 1][2][3] === '#';
    }
    if (y < 0) {
        if (d === 0) {
            return 0;
        }
        return maps[d - 1][1][2] === '#';
    }
    if (y >= maps[0].length) {
        if (d === 0) {
            return 0;
        }
        return maps[d - 1][3][2] === '#';
    }
    const char = maps[d][y][x];
    if (char === '?') {
        if (d === maps.length - 1) {
            return 0;
        }
        const xs = dx === -1 ? [4] : dx === 1 ? [0] : [0, 1, 2, 3, 4];
        const ys = dy === -1 ? [4] : dy === 1 ? [0] : [0, 1, 2, 3, 4];
        let bugs = 0;
        for (let ix = 0; ix < xs.length; ix++) {
            for (let iy = 0; iy < ys.length; iy++) {
                bugs += maps[d + 1][ys[iy]][xs[ix]] === '#';
            }
        }
        return bugs;
    } else {
        return char === '#';
    }
};

const nextIterationRecursiveSpace = maps => {
    let newMaps = [];
    for (let d = 0; d < maps.length; d++) {
        const map = maps[d];
        const newMap = [];
        newMaps.push(newMap);
        let hasBugs = false;
        for (let y = 0; y < map.length; y++) {
            newMap[y] = [];
            for (let x = 0; x < map[y].length; x++) {
                const bugsAdj =
                    getBugs(maps, d, x, y, 0, -1) +
                    getBugs(maps, d, x, y, -1, 0) +
                    getBugs(maps, d, x, y, 1, 0) +
                    getBugs(maps, d, x, y, 0, 1);

                if (map[y][x] === '#' && bugsAdj !== 1) {
                    // bug dies
                    newMap[y][x] = '.';
                } else if (map[y][x] === '.' && bugsAdj >= 1 && bugsAdj <= 2) {
                    // bug created
                    newMap[y][x] = '#';
                    hasBugs = true;
                } else {
                    newMap[y][x] = map[y][x];
                }
            }
        }
        if (hasBugs && d === 0) {
            newMaps = [strToMap(initialDimensionSpace), ...newMaps];
        } else if (hasBugs && d === maps.length - 1) {
            newMaps.push(strToMap(initialDimensionSpace));
        }
    }
    return newMaps;
};

const doPart2 = (input, iterations) => {
    let maps = [
        strToMap(initialDimensionSpace),
        strToMap(input),
        strToMap(initialDimensionSpace),
    ];
    for (let i = 0; i < iterations; i++) {
        maps = nextIterationRecursiveSpace(maps);
    }
    return maps;
};

module.exports = {
    part1() {
        let map = strToMap(input);
        const bioDiversities = [];
        while (true) {
            const nextBioDivesity = bioDiversity(map);
            if (bioDiversities.some(b => b === nextBioDivesity)) {
                return nextBioDivesity;
            }
            bioDiversities.push(nextBioDivesity);
            map = nextIteration(map);
        }
    },
    doPart2,
    part2() {
        let maps = doPart2(input2, 200);
        return maps.flat(Infinity).filter(c => c === '#').length;
    },
    example1() {
        let maps = [
            strToMap(initialDimensionSpace),
            strToMap(`
    ....#
    #..#.
    #.?##
    ..#..
    #....
    `),
            strToMap(initialDimensionSpace),
        ];
        for (let i = 0; i < 10; i++) {
            maps = nextIterationRecursiveSpace(maps);
        }

        return maps.flat(Infinity).filter(c => c === '#').length;
    },
};
