module.exports = (initialData, count, dataWanted) => {
    const orbits = initialData
        .split('<')
        .map(orbitLine => {
            orbitLine = orbitLine.trim().split('>')[0];
            if (!orbitLine) {
                return;
            }
            const vars = orbitLine.split(',');
            return {
                position: vars.reduce((orbit, singleVar) => {
                    const [name, value] = singleVar.trim().split('=');
                    orbit[name] = Number(value);
                    return orbit;
                }, {}),
                velocity: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
            };
        })
        .filter(orbit => Boolean(orbit));

    if (dataWanted === 'repeats') {
        let data = [];
        ['x', 'y', 'z'].forEach(axis => {
            const previousStates = {};
            for (let i = 0; true; i++) {
                const hash = orbits.reduce((hash, orbit) => {
                    return (
                        hash +
                        orbit.position[axis] +
                        ':' +
                        orbit.velocity[axis] +
                        ','
                    );
                }, '');
                if (previousStates[hash] != undefined) {
                    data.push(i);
                    break;
                }
                previousStates[hash] = i;

                for (let a = 0; a < orbits.length; a++) {
                    for (let b = a + 1; b < orbits.length; b++) {
                        if (
                            orbits[a].position[axis] ===
                            orbits[b].position[axis]
                        ) {
                            continue;
                        }
                        if (
                            orbits[a].position[axis] > orbits[b].position[axis]
                        ) {
                            orbits[a].velocity[axis]--;
                            orbits[b].velocity[axis]++;
                        } else {
                            orbits[a].velocity[axis]++;
                            orbits[b].velocity[axis]--;
                        }
                    }
                }

                orbits.forEach(orbit => {
                    orbit.position[axis] += orbit.velocity[axis];
                });
            }
        });

        let gcd = 1;
        for (let i = 1; i <= data[0] && i <= data[1] && i <= data[2]; i++) {
            if (i === 2) {
                console.log(
                    'testing i',
                    i,
                    data[0] % i,
                    data[1] % i,
                    data[2] % i,
                    data
                );
            }
            if (data[0] % i === 0 && data[1] % i === 0 && data[2] % i === 0) {
                gcd = i;
            }
        }

        return {
            data,
            answer: (data[0] / gcd) * (data[1] / gcd) * (data[2] / gcd),
            gcd,
        };
    }

    for (let i = 0; i < count; i++) {
        for (let a = 0; a < orbits.length; a++) {
            for (let b = a + 1; b < orbits.length; b++) {
                ['x', 'y', 'z'].forEach(axis => {
                    if (orbits[a].position[axis] === orbits[b].position[axis]) {
                        return;
                    }
                    if (orbits[a].position[axis] > orbits[b].position[axis]) {
                        orbits[a].velocity[axis]--;
                        orbits[b].velocity[axis]++;
                    } else {
                        orbits[a].velocity[axis]++;
                        orbits[b].velocity[axis]--;
                    }
                });
            }
        }

        orbits.forEach(orbit => {
            ['x', 'y', 'z'].forEach(axis => {
                orbit.position[axis] += orbit.velocity[axis];
            });
        });
    }

    if (dataWanted === 'orbits') {
        return orbits;
    }

    const energy = orbits.reduce(
        (total, orbit) =>
            total +
            ['x', 'y', 'z'].reduce(
                (total, axis) => total + Math.abs(orbit.position[axis]),
                0
            ) *
                ['x', 'y', 'z'].reduce(
                    (total, axis) => total + Math.abs(orbit.velocity[axis]),
                    0
                ),
        0
    );

    if (dataWanted === 'energy') {
        return energy;
    }
};
