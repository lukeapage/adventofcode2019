const getShortestDistances = (map, x, y) => {
    const hashDestToRoutes = {};
    let activeRoutes = [
        {
            x: x,
            y: y,
            route: [],
            doors: [],
            keysOnWay: [],
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
                const newLoc = {
                    x: activeRoute.x + possibleDir.x,
                    y: activeRoute.y + possibleDir.y,
                };
                const newLocType = map[newLoc.y][newLoc.x];
                if (newLocType !== '#') {
                    const hash = `${newLoc.x},${newLoc.y}`;
                    if (
                        hashDestToRoutes[hash] &&
                        hashDestToRoutes[hash].route.length <=
                            activeRoute.route.length + 1
                    ) {
                        // already have a route here thats shorter or the same distance
                        return;
                    }

                    let doors = activeRoute.doors;
                    let keysOnWay = activeRoute.keysOnWay;

                    if (newLocType.match(/[A-Z]/)) {
                        doors = [...doors, newLocType];
                    }

                    if (newLocType.match(/[a-z]/)) {
                        keysOnWay = [...keysOnWay, newLocType];
                    }

                    const newRoute = {
                        ...newLoc,
                        doors,
                        keysOnWay,
                        route: [
                            ...activeRoute.route,
                            {
                                ...newLoc,
                            },
                        ],
                    };

                    hashDestToRoutes[hash] = {
                        doors,
                        keysOnWay: activeRoute.keysOnWay, // keys before the current dest
                        route: newRoute.route,
                    };

                    newActiveRoutes.push(newRoute);
                }
            });
        }

        activeRoutes = newActiveRoutes;
    }

    // console.log('got shortest dists');
    return hashDestToRoutes;
};

function findPieces(map) {
    const keys = [];
    let start;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x].match(/[a-z]/)) {
                keys.push({
                    x,
                    y,
                    key: map[y][x],
                });
            } else if (map[y][x] === '@') {
                start = { x, y };
            }
        }
    }
    return {
        keys,
        start,
    };
}

const timings = {};

const memoized = {};

function getDists(map, keysLeft, keysFetched, curLocation, megaDists) {
    let shortestDist = Infinity;

    const hashForM = keysLeft.sort().join('') + ',' + curLocation;
    if (memoized[hashForM]) {
        return memoized[hashForM];
    }

    let start;
    if (!timings[keysFetched.length]) {
        start = Date.now();
    }

    for (let i = 0; i < keysLeft.length; i++) {
        const firstKey = keysLeft[i];
        const distInfo = megaDists[curLocation + firstKey];
        if (
            distInfo.doors.some(door => {
                const keyToFind = door.toLowerCase();
                const isDoorLocked = keysFetched.indexOf(keyToFind) < 0;
                return isDoorLocked;
            })
        ) {
            continue;
        }
        if (
            false &&
            keysLeft.some(
                keyLeft =>
                    keyLeft !== firstKey &&
                    megaDists[curLocation + keyLeft].keysOnWay.indexOf(
                        firstKey
                    ) >= 0 &&
                    !megaDists[curLocation + keyLeft].doors.some(door => {
                        const keyToFind = door.toLowerCase();
                        const isDoorLocked = keysFetched.indexOf(keyToFind) < 0;
                        return isDoorLocked;
                    })
            )
        ) {
            continue;
        }

        let newKeysLeft = keysLeft.filter(x => x !== firstKey);
        let newKeysFetched = keysFetched.concat([firstKey]);
        const dist = distInfo.dist;
        const keysOnWay = distInfo.keysOnWay;
        if (keysOnWay.length) {
            newKeysFetched = newKeysFetched.concat(
                keysOnWay
                    .map(keyOnWay => newKeysLeft.find(key => key === keyOnWay))
                    .filter(key => Boolean(key))
            );
            newKeysLeft = newKeysLeft.filter(
                key => keysOnWay.indexOf(key) === -1
            );
        }
        if (newKeysLeft.length === 0) {
            if (dist < shortestDist) {
                shortestDist = dist;
            }
        } else if (newKeysLeft.length === 1) {
            const distUnder = megaDists[firstKey + newKeysLeft[0]].dist;
            if (dist + distUnder < shortestDist) {
                shortestDist = dist + distUnder;
            }
        } else {
            const distUnder = getDists(
                map,
                newKeysLeft,
                newKeysFetched,
                firstKey,
                megaDists
            );
            if (dist + distUnder < shortestDist) {
                shortestDist = dist + distUnder;
            }
        }
    }

    if (!timings[keysFetched.length]) {
        timings[keysFetched.length] = true;
        console.log(
            'fetched',
            keysFetched.length,
            '-',
            Date.now() - start,
            'ms'
        );
    }

    memoized[hashForM] = shortestDist;

    return shortestDist;
}

module.exports = map => {
    map = map
        .trim()
        .split('\n')
        .map(line => line.trim().split(''));
    const { keys, start } = findPieces(map);
    console.log('found', keys.length, start);
    const megaDists = {};
    const places = [...keys, { key: '@', ...start }];
    for (let i = 0; i < places.length; i++) {
        const placeDists = getShortestDistances(map, places[i].x, places[i].y);
        for (let j = 0; j < places.length; j++) {
            if (i !== j) {
                const dist = placeDists[`${places[j].x},${places[j].y}`];
                if (!dist.route) {
                    console.log(`${places[j].x},${places[j].y}`, dist);
                }
                megaDists[places[i].key + places[j].key] = megaDists[
                    places[j].key + places[i].key
                ] = {
                    dist: dist.route.length,
                    doors: dist.doors,
                    keysOnWay: dist.keysOnWay,
                };
            }
        }
    }
    console.log('calculated dists');
    const dist = getDists(
        map,
        keys.map(({ key }) => key),
        [],
        '@',
        megaDists
    );
    return dist;
};
