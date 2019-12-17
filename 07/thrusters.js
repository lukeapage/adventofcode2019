const processor = require('../05/processor');
const processor2 = require('./processor');

const fillNums = (i, addOn) =>
    new Array(i).fill(i + 1).map((v, i) => i + addOn);

const seqGen = (i, addOn = 0, leftNums = fillNums(i, addOn)) => {
    if (leftNums.length === 1) {
        return [[leftNums[0]]];
    }
    const returnVal = [];
    for (let j = 0; j < leftNums.length; j++) {
        const myNum = leftNums[j];
        const newLeftNums = leftNums.slice(0);
        newLeftNums.splice(j, 1);
        const subSeqs = seqGen(i - 1, addOn, newLeftNums);
        for (let k = 0; k < subSeqs.length; k++) {
            returnVal.push([myNum].concat(subSeqs[k]));
        }
    }
    return returnVal;
};

const part2 = async (seq, program) => {
    const thrusterInputsWaiting = [0];
    const thrusterProcessors = [];
    const thrusterOutputs = [];
    for (let thruster = 0; thruster <= 4; thruster++) {
        let hasSeq = false;
        const thisThruster = thruster;
        thrusterProcessors[thisThruster] = processor2(
            program,
            () => {
                if (!hasSeq) {
                    hasSeq = true;
                    return seq[thruster];
                }

                if (thrusterInputsWaiting[thisThruster] != null) {
                    const nextInput = thrusterInputsWaiting[thisThruster];
                    thrusterInputsWaiting[thisThruster] = null;
                    return nextInput;
                }

                return new Promise((resolve, reject) => {
                    thrusterInputsWaiting[thisThruster] = resolve;
                });
            },
            nextThrust => {
                const nextThruster = thisThruster === 4 ? 0 : thisThruster + 1;
                thrusterOutputs[thisThruster] = nextThrust;

                if (thrusterInputsWaiting[nextThruster]) {
                    const cb = thrusterInputsWaiting[nextThruster];
                    thrusterInputsWaiting[nextThruster] = null;
                    cb(nextThrust);
                } else {
                    thrusterInputsWaiting[nextThruster] = nextThrust;
                }
            }
        );
    }

    await Promise.all(thrusterProcessors);

    return thrusterOutputs[4];
};

module.exports = {
    thrusters: program => {
        const seqs = seqGen(5);
        let maxThrust = 0;
        let maxSeq;
        seqs.forEach(seq => {
            let currentThrust = 0;
            let history = [];
            for (var thruster = 0; thruster <= 4; thruster++) {
                const { output } = processor(program, [
                    seq[thruster],
                    currentThrust,
                ]);
                history.push({ output });
                currentThrust = output;
            }

            if (currentThrust > maxThrust) {
                maxThrust = currentThrust;
                maxSeq = seq;
            }
        });

        return maxThrust;
    },
    thrusters2: async program => {
        const seqs = seqGen(5, 5);
        let maxThrust = 0;
        let maxSeq;

        await Promise.all(
            seqs.map(async seq => {
                const currentThrust = await part2(seq, program);

                if (currentThrust > maxThrust) {
                    maxThrust = currentThrust;
                    maxSeq = seq;
                }
            })
        );

        return maxThrust;
    },
};
