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
    const starts = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x].match(/[a-z]/)) {
                keys.push({
                    x,
                    y,
                    key: map[y][x],
                });
            } else if (map[y][x].match(/[$%^&@]/)) {
                starts.push({ x, y, key: map[y][x] });
            }
        }
    }
    return {
        keys,
        starts,
    };
}

const memoized = {};

function getDists(map, keysLeft, keysFetched, curLocations, megaDists) {
    let shortestDist = Infinity;

    const hashForM = keysLeft.sort().join('') + ',' + curLocations.join('-');
    if (memoized[hashForM]) {
        return memoized[hashForM];
    }

    for (let i = 0; i < keysLeft.length; i++) {
        const firstKey = keysLeft[i];
        const curLocationIndex = curLocations.findIndex(curLocation =>
            Boolean(megaDists[curLocation + firstKey])
        );
        const curLocation = curLocations[curLocationIndex];
        if (curLocationIndex < 0) {
            throw new Error(
                `cannot find a location index for ${firstKey} from ${curLocations.join(
                    ','
                )} - ${megaDists['@m']}`
            );
        }
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
        } else {
            const newLocations = curLocations.slice(0);
            newLocations[curLocationIndex] = firstKey;
            const distUnder = getDists(
                map,
                newKeysLeft,
                newKeysFetched,
                newLocations,
                megaDists
            );
            if (dist + distUnder < shortestDist) {
                shortestDist = dist + distUnder;
            }
        }
    }

    memoized[hashForM] = shortestDist;

    return shortestDist;
}

module.exports = map => {
    map = map
        .trim()
        .split('\n')
        .map(line => line.trim().split(''));
    const { keys, starts } = findPieces(map);

    const megaDists = {};
    const places = [...keys, ...starts];
    for (let i = 0; i < places.length; i++) {
        const placeDists = getShortestDistances(map, places[i].x, places[i].y);
        for (let j = 0; j < places.length; j++) {
            if (i !== j) {
                const dist = placeDists[`${places[j].x},${places[j].y}`];
                if (dist) {
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
    }

    const dist = getDists(
        map,
        keys.map(({ key }) => key),
        [],
        ['@', '$', '%', '^'],
        megaDists
    );
    return dist;
};
