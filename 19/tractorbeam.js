const program = require('./input');
const processor = require('../09/processor');

module.exports = async (part = 1) => {
    let pulled = 0;
    const data = [];
    let xStarts = [];
    let xEnds = [];
    let yStarts = [];
    let yEnds = [];
    const multiplier = part === 1 ? 1 : 50;
    for (let x = 0; x < 50 * multiplier; x++) {
        let processorCalls = 0;
        for (
            let y = Math.max(yStarts[x - 1] - 1 || 0, 0);
            part === 1 ? y < 50 : processorCalls < 200;
            y++
        ) {
            const input = [x, y];
            let i = 0;
            let thisXYPulls = 0;
            processorCalls++;
            await processor(
                program,
                () => {
                    if (i === 2) {
                        throw new Error(`unexpected end of input`);
                    }
                    return input[i++];
                },
                isPulled => {
                    thisXYPulls = isPulled;
                }
            );
            pulled += thisXYPulls;

            if (thisXYPulls) {
                if (xStarts[y] === undefined) {
                    xStarts[y] = x;
                }
            } else if (xStarts[y] !== undefined && xEnds[y] === undefined) {
                xEnds[y] = x;
            }

            if (thisXYPulls) {
                if (yStarts[x] === undefined) {
                    yStarts[x] = y;
                    if (part === 2 && yEnds[x - 1] > 0) {
                        // skip to the end of the last x
                        y = yEnds[x - 1] - 1;
                    }
                }
            } else if (yStarts[x] !== undefined && yEnds[x] === undefined) {
                yEnds[x] = y;
                // skip any more, we are finished on y
                break;
            }
        }
    }
    if (part === 1) {
        return pulled;
    } else {
        let minDistance = Infinity;
        let minPos;
        for (let x = 0; x < 50 * multiplier; x++) {
            for (let y = 0; y < 50 * multiplier; y++) {
                if (xEnds[y] && yEnds[x]) {
                    if (
                        xEnds[y] - Math.max(xStarts[y], x) >= 100 &&
                        yEnds[x] - Math.max(yStarts[x], y) >= 100
                    ) {
                        if (x + y < minDistance) {
                            minDistance = x + y;
                            minPos = x * 10000 + y;
                        }
                    }
                }
            }
        }
        return minPos;
    }
};
