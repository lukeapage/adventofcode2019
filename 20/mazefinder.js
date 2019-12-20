const getShortestDistances = (map, start, portals, end) => {
    const hashDestToRoutes = {};
    let activeRoutes = [
        {
            x: start.out.x,
            y: start.out.y,
            route: [],
        },
    ];
    const possibleDirections = [
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: -1, y: 0 },
    ];
    while (activeRoutes.length) {
        let newActiveRoutes = [];
        for (let i = activeRoutes.length - 1; i >= 0; i--) {
            const activeRoute = activeRoutes[i];
            possibleDirections.forEach(possibleDir => {
                let newLoc = {
                    x: activeRoute.x + possibleDir.x,
                    y: activeRoute.y + possibleDir.y,
                };
                let isEnd = false;
                const newLocType = map[newLoc.y][newLoc.x];
                if (newLocType === '.' || newLocType.match(/[A-Z]/)) {
                    if (newLocType.match(/[A-Z]/)) {
                        const portal = portals.find(
                            portal =>
                                portal.x === newLoc.x && portal.y === newLoc.y
                        );
                        if (
                            !portal &&
                            newLoc.x === start.x &&
                            newLoc.y === start.y
                        ) {
                            return;
                        }
                        if (portal) {
                            if (!portal.other) {
                                throw new Error(`No other portal found`);
                            }
                            newLoc = {
                                x: portal.other.out.x,
                                y: portal.other.out.y,
                            };
                        } else {
                            if (newLoc.x !== end.x || newLoc.y !== end.y) {
                                throw new Error(
                                    `Unable to find portal from ${newLoc.x},${newLoc.y} - ${newLocType}`
                                );
                            }
                            isEnd = true;
                        }
                    }

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
                            },
                        ],
                    };

                    hashDestToRoutes[hash] = {
                        route: newRoute.route,
                    };

                    if (!isEnd) {
                        newActiveRoutes.push(newRoute);
                    }
                }
            });
        }

        activeRoutes = newActiveRoutes;
    }

    return hashDestToRoutes;
};

function findPieces(map) {
    const portals = [];
    const hash = {};
    let start;
    let end;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            for (let d = 0; d < 2; d++) {
                const delta = d === 0 ? { x: 1, y: 0 } : { x: 0, y: 1 };
                if (
                    map[y][x].match(/[A-Z]/) &&
                    y + delta.y < map.length &&
                    x + delta.x < map[y + delta.y].length &&
                    map[y + delta.y][x + delta.x].match(/[A-Z]/)
                ) {
                    const after =
                        y + delta.y * 2 < map.length &&
                        map[y + delta.y * 2][x + delta.x * 2] === '.';
                    const before =
                        y - delta.y >= 0 &&
                        map[y - delta.y][x - delta.x] === '.';
                    if (!after && !before) {
                        console.log(
                            'found',
                            map[y][x] + map[y + delta.y][x + delta.x],
                            'with no after or before'
                        );
                        continue;
                    }
                    if (after && before) {
                        throw new Error(`Not expected`);
                    }
                    const portal = {
                        x: before ? x : x + delta.x,
                        y: before ? y : y + delta.y,
                        key: map[y][x] + map[y + delta.y][x + delta.x],
                        out: {
                            x: before ? x - delta.x : x + delta.x * 2,
                            y: before ? y - delta.y : y + delta.y * 2,
                        },
                    };
                    // console.log('found', portal.key);
                    if (portal.key === 'AA') {
                        start = portal;
                    } else if (portal.key === 'ZZ') {
                        end = portal;
                    } else {
                        if (hash[portal.key]) {
                            portal.other = hash[portal.key];
                            hash[portal.key].other = portal;
                        } else {
                            hash[portal.key] = portal;
                        }
                        portals.push(portal);
                    }
                }
            }
        }
    }
    if (!start || !end) {
        throw new Error(
            `unable to find start ${start} or end ${end} - ${portals.length}`
        );
    }
    return { portals, start, end };
}

module.exports = mapStr => {
    const map = mapStr
        .replace(/^\n+|\n+$/g, '')
        .split('\n')
        .map(strLine => strLine.split(''));
    const { portals, start, end } = findPieces(map);

    const hashMap = getShortestDistances(map, start, portals, end);

    return hashMap[`${end.x},${end.y}`].route.length - 1;
};
