const getShortestDistances = (map, start, portals, end) => {
    const hashDestToRoutes = {};
    let activeRoutes = [
        {
            x: start.out.x,
            y: start.out.y,
            route: 0,
            level: 0,
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
                let newLevel = activeRoute.level;
                if (newLocType === '.' || newLocType.match(/[A-Z]/)) {
                    let portal;
                    if (newLocType.match(/[A-Z]/)) {
                        portal = portals.find(
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
                            // we cannot go to negative levels
                            if (newLevel === 0 && !portal.isInner) {
                                return;
                            }
                            newLevel = newLevel + (portal.isInner ? 1 : -1);
                            // stop infinite recursion
                            if (newLevel > portals.length) {
                                // console.log('stopping infinite recursion');
                                return;
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
                            if (newLevel === 0) {
                                isEnd = true;
                            } else {
                                // end is a wall until the end
                                return;
                            }
                        }
                    }

                    const hash = `${newLoc.x},${newLoc.y}-${newLevel}`;
                    if (
                        hashDestToRoutes[hash] &&
                        hashDestToRoutes[hash].route <= activeRoute.route + 1
                    ) {
                        // already have a route here thats shorter or the same distance
                        return;
                    }

                    const newRoute = {
                        ...newLoc,
                        level: newLevel,
                        route: activeRoute.route + 1,
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
                    // its an inner portal if it has hashes on both left and right
                    const isInner =
                        map[y].some((c, i) => i < x && c === '#') &&
                        map[y].some((c, i) => i > x && c === '#');
                    const portal = {
                        x: before ? x : x + delta.x,
                        y: before ? y : y + delta.y,
                        isInner,
                        key: map[y][x] + map[y + delta.y][x + delta.x],
                        out: {
                            x: before ? x - delta.x : x + delta.x * 2,
                            y: before ? y - delta.y : y + delta.y * 2,
                        },
                    };
                    // console.log('found', portal.key, portal.isInner);
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

    return hashMap[`${end.out.x},${end.out.y}-0`].route;
};
