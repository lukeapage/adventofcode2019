const droid = require('./droid');
const processor = require('../09/processor');

const w = 100;
const h = 100;

module.exports = async () => {
    const map = [];
    let x = w / 2;
    let y = h / 2;
    map[y] = [];
    map[y][x] = 0;
    const unknowns = [];
    const addUnknowns = () => {
        const possibleDirections = [
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: -1, y: 0 },
        ];
        possibleDirections.forEach(direction => {
            const pX = x + direction.x;
            const pY = y + direction.y;
            if (!map[pY] || map[pY][pX] === undefined) {
                if (!unknowns.find(({ x, y }) => x === pX && y === pY)) {
                    unknowns.push({
                        x: pX,
                        y: pY,
                    });
                }
            }
        });
    };
    addUnknowns();
    let newLoc = { x, y };
    let currentRoute = [];
    const findRoute = toLoc => {
        const hashDestToRoutes = {};
        let activeRoutes = [
            {
                x: x,
                y: y,
                route: [],
            },
        ];
        const possibleDirections = [
            { x: 0, y: 1, code: 2 },
            { x: 1, y: 0, code: 4 },
            { x: 0, y: -1, code: 1 },
            { x: -1, y: 0, code: 3 },
        ];
        const getLocType = a => {
            if (!map[a.y]) return undefined;
            return map[a.y][a.x];
        };

        while (activeRoutes.length) {
            let newActiveRoutes = [];
            for (let i = activeRoutes.length - 1; i >= 0; i--) {
                const activeRoute = activeRoutes[i];
                possibleDirections.forEach(possibleDir => {
                    const newLoc = {
                        x: activeRoute.x + possibleDir.x,
                        y: activeRoute.y + possibleDir.y,
                    };
                    const newLocType = getLocType(newLoc);
                    if (
                        newLocType === 1 ||
                        newLocType === 2 ||
                        newLocType === undefined
                    ) {
                        const hash = `${newLoc.x},${newLoc.y}`;
                        if (
                            hashDestToRoutes[hash] &&
                            hashDestToRoutes[hash].route.length <=
                                activeRoute.route.length + 1
                        ) {
                            // already have a route here thats shorter or the same distance
                            return;
                        }

                        const newRoute = {
                            ...newLoc,
                            route: [
                                ...activeRoute.route,
                                {
                                    ...newLoc,
                                    dirCode: possibleDir.code,
                                },
                            ],
                        };

                        hashDestToRoutes[hash] = {
                            route: newRoute.route,
                        };

                        // can only continue route if the current tile is defined
                        if (newLocType !== undefined) {
                            newActiveRoutes.push(newRoute);
                        }
                    }
                });
            }

            activeRoutes = newActiveRoutes;
        }

        if (toLoc === 'MAX') {
            const sortedDist = Object.keys(hashDestToRoutes)
                .map(key => hashDestToRoutes[key].route.length)
                .sort((a, b) => (a > b ? 1 : -1));
            return sortedDist[sortedDist.length - 1];
        } else {
            const hash = `${toLoc.x},${toLoc.y}`;
            if (!hashDestToRoutes[hash]) {
                throw new Error(`unable to get from ${x},${y} to ${hash}`);
            }
            return hashDestToRoutes[hash].route;
        }
    };
    let error;
    let locOxygen;
    try {
        await processor(
            droid,
            () => {
                let next;
                if (currentRoute.length) {
                    next = currentRoute.shift();
                    false &&
                        console.log(
                            `returning a route item ${next.x},${next.y},${next.dirCode}`
                        );
                    newLoc = next;
                    return next.dirCode;
                }
                if (unknowns.length === 0) {
                    return 'QUIT';
                }
                // sort the shortest so far
                const distance = a => Math.abs(a.x - x) + Math.abs(a.y - y);
                unknowns.sort((a, b) => {
                    const aD = distance(a);
                    const bD = distance(b);
                    if (aD === bD) {
                        return 0;
                    }
                    return aD > bD ? 1 : -1;
                });
                // assert sort direction
                if (
                    unknowns.length > 2 &&
                    distance(unknowns[0]) > distance(unknowns[1])
                ) {
                    throw new Error('Sort direction is wrong');
                }
                let nextUnknown;
                do {
                    if (unknowns.length === 0) {
                        return 'QUIT';
                    }

                    nextUnknown = unknowns.shift();
                } while (
                    map[nextUnknown.y] &&
                    map[nextUnknown.y][nextUnknown.x] !== undefined
                );

                currentRoute = findRoute(nextUnknown);
                next = currentRoute.shift();
                false &&
                    console.log(
                        `going to unknown ${nextUnknown.x},${
                            nextUnknown.y
                        } 1st - ${next.x},${next.y} dir ${
                            next.dirCode
                        } in list of ${currentRoute.length + 1}`
                    );
                newLoc = next;
                return next.dirCode;
            },
            locType => {
                false &&
                    console.log(
                        `got output ${newLoc.x} ${newLoc.y} ${locType}`
                    );
                if (!map[newLoc.y]) {
                    map[newLoc.y] = [];
                }
                if (
                    map[newLoc.y][newLoc.x] !== undefined &&
                    map[newLoc.y][newLoc.x] !== locType
                ) {
                    throw new Error(
                        `passing same location and got different result :( ${
                            newLoc.x
                        } ${newLoc.y} ${locType} ${map[newLoc.y][newLoc.x]}`
                    );
                }
                map[newLoc.y][newLoc.x] = locType;

                if (locType === 0) {
                    // hit a wall
                } else if (locType === 1 || locType === 2) {
                    y = newLoc.y;
                    x = newLoc.x;
                    addUnknowns();
                    if (locType === 2) {
                        locOxygen = { x, y };
                    }
                } else {
                    throw new Error(`Unrecognized location type ${locType}`);
                }
            }
        );
    } catch (e) {
        error = e;
    }

    let curLoc = { x, y };
    let printed = '\n';
    for (y = 0; y < map.length; y++) {
        if (map[y]) {
            for (x = 0; x < map[y].length; x++) {
                if (curLoc.x === x && curLoc.y === y) {
                    printed += 'X';
                    continue;
                }
                const char = map[y][x];
                switch (char) {
                    case undefined:
                        printed += ' ';
                        break;
                    case 0:
                        printed += '█';
                        break;
                    case 1:
                        printed += '.';
                        break;
                    case 2:
                        printed += 'O';
                        break;
                }
            }
            printed += '\n';
        }
    }

    console.log(printed);

    if (error) {
        throw error;
    }

    x = w / 2;
    y = h / 2;
    const distance = findRoute(locOxygen).length;

    x = locOxygen.x;
    y = locOxygen.y;
    const minutesForOxygen = findRoute('MAX');

    return { printed, distance, minutesForOxygen };
};
