const iterateOrbits = (roots, cb, depth = 0, visited = [], rootIndex) => {
    const isRoot = rootIndex === undefined;
    for (let index = roots.length - 1; index >= 0; index--) {
        const registeredOrbit = roots[index];
        const isVisited =
            visited.find(visitedOrbit => visitedOrbit === registeredOrbit) >= 0;
        if (isVisited) {
            return;
        }
        cb(registeredOrbit, isRoot ? index : rootIndex, depth);
        visited.push(registeredOrbit);
        iterateOrbits(
            registeredOrbit.orbits,
            cb,
            depth + 1,
            visited,
            isRoot ? index : rootIndex
        );
    }
};

const makeOrbits = orbits => {
    const roots = [];
    orbits.forEach(orbit => {
        const [a, b] = orbit.split(')');
        const orbitObj = {
            a,
            b,
            orbits: [],
            parent: null,
        };
        let isAddedB = false;
        iterateOrbits(roots, (registeredOrbit, rootIndex) => {
            if (registeredOrbit.a === b) {
                orbitObj.orbits.push(registeredOrbit);
                registeredOrbit.parent = orbitObj;
                isAddedB = true;
                roots.splice(rootIndex, 1);
            }
        });
        let isAddedA = false;
        iterateOrbits(roots, registeredOrbit => {
            if (!isAddedA && registeredOrbit.b === a) {
                registeredOrbit.orbits.push(orbitObj);
                orbitObj.parent = registeredOrbit;
                isAddedA = true;
            }
        });

        if (!isAddedA) {
            roots.push(orbitObj);
        }
    });

    if (roots.length > 1) {
        throw new Error(`roo many roots ${roots.length}`);
    }
    return roots[0];
};

const iterateParents = (orbit, parents = [orbit.a]) => {
    if (orbit.parent) {
        parents.push(orbit.parent.a);
        iterateParents(orbit.parent, parents);
    }
    return parents;
};

module.exports = (orbits, from, to) => {
    const root = makeOrbits(orbits);

    if (!from) {
        let orbitCount = 0;
        iterateOrbits([root], (orbit, rootIndex, depth) => {
            // console.log({ orbit, depth });
            orbitCount += depth + 1;
        });

        return orbitCount;
    } else {
        let fromParents;
        iterateOrbits([root], registeredOrbit => {
            if (registeredOrbit.b === from) {
                console.log('found', from);
                fromParents = iterateParents(registeredOrbit);
            }
        });
        let toParents;
        iterateOrbits([root], registeredOrbit => {
            if (registeredOrbit.b === to) {
                toParents = iterateParents(registeredOrbit);
            }
        });
        // console.log(fromParents);
        // console.log(toParents);
        let minLength = Infinity;
        for (let i = 0; i < fromParents.length; i++) {
            for (let j = 0; j < toParents.length; j++) {
                if (fromParents[i] === toParents[j]) {
                    minLength = Math.min(minLength, i + j);
                }
            }
        }
        return minLength;
    }
};
