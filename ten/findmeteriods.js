module.exports = map => {
    map = map.trim().split('\n');
    const meteriods = [];
    for (let y = 0; y < map.length; y++) {
        const line = map[y].trim().split('');
        for (let x = 0; x < line.length; x++) {
            if (line[x] === '#') {
                meteriods.push({
                    x,
                    y,
                });
            }
        }
    }
    meteriods.forEach(m1 => {
        const others = meteriods
            .map(m2 => {
                if (m1 === m2) return;
                let angle =
                    (Math.atan2(m2.x - m1.x, m1.y - m2.y) * 180) / Math.PI;
                if (angle < 0) {
                    angle = angle + 360;
                }
                if (angle > 360) {
                    angle = angle - 360;
                }
                angle = Math.round(angle * 10000);
                return {
                    m: m2,
                    angle,
                    distance: Math.sqrt(
                        Math.pow(Math.abs(m1.y - m2.y), 2) +
                            Math.pow(Math.abs(m1.x - m2.x), 2)
                    ),
                };
            })
            .filter(ang => ang !== undefined);

        const visible = [...new Set(others.map(data => data.angle))].length;
        m1.visible = visible;
        m1.others = others;
    });

    const bestM = meteriods.sort((m1, m2) => {
        return m1.visible > m2.visible ? -1 : 1;
    })[0];

    if (map[0].length < 20) {
        return { x: bestM.x, y: bestM.y, visible: bestM.visible };
    }

    bestM.others.sort((a1, a2) => {
        return a1.angle > a2.angle ? 1 : -1;
    });

    const sortedOthers = [[]];
    let j = 0;
    let currentAngle = bestM.others[0].angle;
    for (let i = 0; i < bestM.others.length; i++) {
        if (bestM.others[i].angle !== currentAngle) {
            sortedOthers[++j] = [];
            currentAngle = bestM.others[i].angle;
        }
        sortedOthers[j].push(bestM.others[i]);
    }

    sortedOthers.forEach(sameAngle => {
        sameAngle.sort((d1, d2) => (d1.distance > d2.distance ? 1 : -1));
    });

    j = 0;
    for (let i = 0; i < 199; i++) {
        sortedOthers[j].shift();
        if (sortedOthers[j].length === 0) {
            sortedOthers.splice(j, 1);
        } else {
            j++;
        }
        if (j === sortedOthers.length) {
            j = 0;
        }
    }

    const twoH = sortedOthers[j][0].m;

    return { part1: bestM.visible, part2: twoH.x * 100 + twoH.y };
};
