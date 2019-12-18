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
                        keysOnWay,
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

function getDists(map, keysLeft, keysFetched, curLocation, megaDists) {
    const curLocationHash = `${curLocation.x},${curLocation.y}`;
    if (!megaDists[curLocationHash]) {
        // console.log('making shortest dists');
        megaDists[curLocationHash] = getShortestDistances(
            map,
            curLocation.x,
            curLocation.y
        );
    }
    const distsFromCurLoc = megaDists[curLocationHash];
    let keysAccessible = keysLeft.filter(
        ({ x, y }) =>
            distsFromCurLoc[`${x},${y}`].doors.filter(door => {
                const keyToFind = door.toLowerCase();
                return !keysFetched.find(({ key }) => key === keyToFind);
            }).length === 0
    );
    /*.sort((aKey, bKey) => {
            const aDist = distsFromCurLoc[`${aKey.x},${aKey.y}`];
            const bDist = distsFromCurLoc[`${bKey.x},${bKey.y}`];
            return aDist > bDist ? 1 : -1;
        });*/
    const dists = [];

    // console.log(keysAccessible.length, 'out of', keysLeft.length);

    for (let i = 0; i < keysAccessible.length; i++) {
        const firstKey = keysAccessible[0];
        let newKeysLeft = keysLeft.filter(x => x !== firstKey);
        let newKeysFetched = [...keysFetched, firstKey];
        const dist =
            distsFromCurLoc[`${firstKey.x},${firstKey.y}`].route.length;
        const keysOnWay =
            distsFromCurLoc[`${firstKey.x},${firstKey.y}`].keysOnWay;
        if (keysOnWay.length) {
            newKeysLeft = newKeysLeft.filter(
                ({ key }) => keysOnWay.indexOf(key) === -1
            );
            newKeysFetched = [
                ...newKeysFetched,
                keysOnWay.map(keyOnWay =>
                    keysLeft.find(({ key }) => key === keyOnWay)
                ),
            ];
        }
        if (newKeysLeft.length === 0) {
            dists.push(dist);
        } else {
            getDists(
                map,
                newKeysLeft,
                newKeysFetched,
                firstKey,
                megaDists
            ).forEach(laterDist => {
                dists.push(laterDist + dist);
            });
        }
    }
    return dists;
}

module.exports = map => {
    map = map
        .trim()
        .split('\n')
        .map(line => line.trim().split(''));
    const { keys, start } = findPieces(map);
    console.log('found', keys.length, start);
    const dists = getDists(map, keys, [], start, {});
    return dists.sort((a, b) => (a > b ? 1 : -1))[0];
};
