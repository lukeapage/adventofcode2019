const input = require('./input');
const processor = require('../09/processor');

function findStart(map) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (
                map[y][x] === '^' ||
                map[y][x] === 'v' ||
                map[y][x] === '<' ||
                map[y][x] === '>'
            ) {
                return { x, y };
            }
        }
    }
}

function isIntersection(map, x, y) {
    return (
        x > 0 &&
        y > 0 &&
        map[y][x] === '#' &&
        map[y - 1][x] === '#' &&
        map[y + 1][x] === '#' &&
        map[y][x - 1] === '#' &&
        map[y][x + 1] === '#'
    );
}

function nextPoint(route) {
    const dirToXY = {
        '^': { x: 0, y: -1 },
        v: { x: 0, y: 1 },
        '<': { x: -1, y: 0 },
        '>': { x: 1, y: 0 },
    };
    return {
        x: route.x + dirToXY[route.direction].x,
        y: route.y + dirToXY[route.direction].y,
    };
}

function changeDir(dir, LorR) {
    const dirs = ['^', '>', 'v', '<'];
    const dirN = dirs.indexOf(dir);
    const newDirN = (dirN + (LorR === 'L' ? -1 : 1)) % 4;
    const nextDir = dirs[newDirN === -1 ? 3 : newDirN];
    return nextDir;
}

function forward(instructions) {
    instructions = instructions.slice(0);
    if (
        instructions.length &&
        instructions[instructions.length - 1].match(/\d+/)
    ) {
        instructions[instructions.length - 1] = String(
            Number(instructions[instructions.length - 1]) + 1
        );
    } else {
        instructions.push('1');
    }
    return instructions;
}

function getIs360(inst, LorR) {
    const last = inst.length - 1;
    // simplify - disallow the longer way round
    return (
        last >= 0 && inst[last] === LorR //&&
        //        inst[last - 1] === LorR //&&
        //inst[last - 2] === LorR
    );
}

function isEqual(seq, instructions, index) {
    for (let i = 0; i < seq.length; i++) {
        if (seq[i] !== instructions[index + i]) {
            return false;
        }
    }
    return true;
}

function removeFromInstr(seq, instructions) {
    for (let i = 0; i < instructions.length - (seq.length - 1); i++) {
        if (isEqual(seq, instructions, i)) {
            instructions = [
                ...instructions.slice(0, i),
                ...instructions.slice(i + seq.length),
            ];
            i -= 1;
        }
    }
    return instructions;
}

function tryEncode({ instructions }) {
    for (let a = 1; a < 10; a++) {
        let aSeq = instructions.slice(0, a);
        let leftInstrA = removeFromInstr(aSeq, instructions);
        // console.log('trying', aSeq);
        // console.log(instructions.length, '=>', leftInstrA.length);
        for (let b = 1; b < Math.min(10, leftInstrA.length); b++) {
            let bSeq = leftInstrA.slice(0, b);
            let leftInstrB = removeFromInstr(bSeq, leftInstrA);
            // console.log('trying', bSeq);
            // console.log(leftInstrA.length, '=>', leftInstrB.length);
            for (let c = 1; c < Math.min(10, leftInstrB.length); c++) {
                let cSeq = leftInstrB.slice(0, c);
                let leftInstrC = removeFromInstr(cSeq, leftInstrB);
                if (leftInstrC.length === 0) {
                    console.log('found gold');
                    let seqs = [];
                    for (let i = 0; i < instructions.length; i++) {
                        if (isEqual(aSeq, instructions, i)) {
                            seqs.push('A');
                            i += aSeq.length - 1;
                        }
                        if (isEqual(bSeq, instructions, i)) {
                            seqs.push('B');
                            i += bSeq.length - 1;
                        }
                        if (isEqual(cSeq, instructions, i)) {
                            seqs.push('C');
                            i += cSeq.length - 1;
                        }
                    }
                    return [
                        seqs.join(','),
                        aSeq.join(','),
                        bSeq.join(','),
                        cSeq.join(','),
                        'n',
                        '',
                    ].join(String.fromCharCode(10));
                }
            }
        }
    }
    return;
}

function calcRoute(map) {
    const start = findStart(map);
    let routes = [
        {
            ...start,
            instructions: [],
            direction: map[start.y][start.x],
            visited: {},
        },
    ];
    const bars = map
        .join('')
        .split('')
        .filter(char => char === '#').length;
    const finishedRoutes = [];
    while (routes.length) {
        let newRoutes = [];
        console.log('calculating routes', routes.length);
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            const next = nextPoint(route);
            // console.log('next step', next, 'from', route.x, route.y);
            const intersection = isIntersection(map, route.x, route.y);
            const mayContinue =
                next.y < map.length &&
                next.y >= 0 &&
                map[next.y][next.x] === '#';
            const lastTurn =
                route.instructions.length &&
                route.instructions[route.instructions.length - 1];
            const shouldTryTurn = intersection || !mayContinue;

            // continue
            if (mayContinue) {
                // console.log('may continue');
                let visited = { ...route.visited };
                const nextVisitHash = `${next.x},${next.y}`;
                const nextIsIntersection = isIntersection(map, next.x, next.y);
                if (!visited[nextVisitHash] || nextIsIntersection) {
                    visited[nextVisitHash] = true;
                    newRoutes.push({
                        ...next,
                        direction: route.direction,
                        instructions: forward(route.instructions),
                        visited,
                    });
                }
            }

            if (Object.keys(route.visited).length === bars) {
                finishedRoutes.push(route);
            } else {
                if (
                    shouldTryTurn &&
                    lastTurn !== 'R' &&
                    !getIs360(route.instructions, 'L')
                ) {
                    //console.log('turning L');
                    newRoutes.push({
                        ...route,
                        direction: changeDir(route.direction, 'L'),
                        instructions: [...route.instructions, 'L'],
                    });
                }
                if (
                    shouldTryTurn &&
                    lastTurn !== 'L' &&
                    !getIs360(route.instructions, 'R')
                ) {
                    // console.log('turning R');
                    newRoutes.push({
                        ...route,
                        direction: changeDir(route.direction, 'R'),
                        instructions: [...route.instructions, 'R'],
                    });
                }
            }
        }
        routes = newRoutes;
    }
    console.log('found', finishedRoutes.length);
    let encodedRoute;
    for (let i = 0; i < finishedRoutes.length; i++) {
        encodedRoute = tryEncode(finishedRoutes[i]);
        if (encodedRoute) {
            console.log('found encoded route', encodedRoute.length);
            return encodedRoute.split('').map(char => char.charCodeAt(0));
        }
    }
    return ['QUIT'];
}

module.exports = {
    removeFromInstr,
    async getMap() {
        let map = '';
        await processor(
            input,
            () => {
                throw new Error('unexpected input required');
            },
            output => {
                map += String.fromCharCode(output);
            }
        );
        return map;
    },
    async part2() {
        let map = '';
        let inp;
        const part2Input = input.slice(0);
        part2Input[0] = 2;
        let spaceDust;
        await processor(
            part2Input,
            () => {
                if (!inp) {
                    inp = calcRoute(map.trim().split('\n'));
                }
                if (inp.length === 0) {
                    throw new Error('ran out of inp');
                }
                return inp.shift();
            },
            output => {
                if (!inp) {
                    map += String.fromCharCode(output);
                }
                console.log(
                    'after inp, got output',
                    output,
                    String.fromCharCode(output)
                );
                spaceDust = output;
            }
        );
        return spaceDust;
    },
    mapToJoins(map) {
        let alignmentParam = 0;
        map = map.trim();
        const mapA = map.split('\n');
        for (let y = 1; y < mapA.length - 1; y++) {
            for (let x = 1; x < mapA[y].length - 1; x++) {
                if (isIntersection(mapA, x, y)) {
                    alignmentParam += x * y;
                }
            }
        }
        return alignmentParam;
    },
};
