let debug = (...args) => {
    false && console.log(...args);
};

const getParam = (program, i, modes, offset, relativeBase) => {
    const mode = modes[offset - 1] || 0;
    const val = program[i + offset];
    if (mode === 0) {
        if (program[val] === undefined) {
            program[val] = 0;
        }
        return program[val];
    } else if (mode === 1) {
        return val;
    } else if (mode === 2) {
        if (program[val + relativeBase] === undefined) {
            program[val + relativeBase] = 0;
        }
        return program[val + relativeBase];
    } else {
        throw new Error('invalid mode');
    }
};

const getParams = (
    program,
    i,
    modes,
    paramsCount,
    addrParamsCount,
    relativeBase
) => {
    return [
        ...new Array(paramsCount)
            .fill(0, 0, paramsCount)
            .map((zero, index) =>
                getParam(program, i, modes, index + 1, relativeBase)
            ),
        ...new Array(addrParamsCount)
            .fill(0, 0, addrParamsCount)
            .map((zero, index) => {
                const mode = modes[index + paramsCount] || 0;
                const val = program[i + index + 1 + paramsCount];
                if (mode === 0) {
                    return val;
                } else if (mode === 2) {
                    return val + relativeBase;
                } else {
                    throw new Error('invalid mode');
                }
            }),
    ];
};

const run = async (program, cbInput, cbOutput) => {
    let output;
    program = program.slice(0);
    let relativeBase = 0;
    let i = 0;

    if (typeof cbInput === 'number') {
        cbInput = [cbInput];
    }

    if (Array.isArray(cbInput)) {
        let currentInputI = 0;
        let inputArr = cbInput;
        cbInput = () => {
            if (currentInputI === inputArr.length) {
                throw new Array('out of inputs');
            }
            return inputArr[currentInputI++];
        };
    }

    const ops = {
        '1': {
            params: 2,
            addrParams: 1,
            debug: 'ADD',
            fn(a, b, pos) {
                program[pos] = a + b;
            },
        },
        '2': {
            params: 2,
            addrParams: 1,
            debug: 'MUL',
            fn(a, b, pos) {
                program[pos] = a * b;
            },
        },
        '7': {
            params: 2,
            addrParams: 1,
            debug: 'LT',
            fn(a, b, pos) {
                program[pos] = a < b ? 1 : 0;
            },
        },
        '8': {
            params: 2,
            addrParams: 1,
            debug: 'EQ',
            fn(a, b, pos) {
                program[pos] = a === b ? 1 : 0;
            },
        },
        '3': {
            params: 0,
            addrParams: 1,
            debug: 'INP',
            async fn(pos) {
                const curInput = await cbInput();
                if (curInput === 'QUIT') {
                    return true;
                }
                program[pos] = curInput;
            },
        },
        '4': {
            params: 1,
            addrParams: 0,
            debug: 'OUT',
            fn(a) {
                if (output === undefined) {
                    output = a;
                } else {
                    if (Array.isArray(output)) {
                        output.push(a);
                    } else {
                        output = [output, a];
                    }
                }
                if (cbOutput) {
                    cbOutput(a);
                }
            },
        },
        '5': {
            params: 2,
            addrParams: 0,
            debug: 'JNE',
            fn(a, b) {
                if (a !== 0) {
                    i = b;
                }
            },
        },
        '6': {
            params: 2,
            addrParams: 0,
            debug: 'JEQ',
            fn(a, b) {
                if (a === 0) {
                    i = b;
                }
            },
        },
        '9': {
            params: 1,
            addrParams: 0,
            debug: 'SRB',
            fn(a) {
                relativeBase += a;
            },
        },
    };

    while (i < program.length) {
        let instr = program[i];
        const opcode = Number(String(instr).slice(-2));
        const modes = String(instr)
            .slice(0, -2)
            .split('')
            .reverse()
            .map(Number);

        if (opcode === 99) break;

        const op = ops[opcode];

        if (!op) {
            throw new Error(`invalid opcode ${opcode} from ${instr}`);
        }

        let currentI = i;
        const params = getParams(
            program,
            i,
            modes,
            op.params,
            op.addrParams,
            relativeBase
        );

        debug(op.debug, ...params);

        const shouldQuit = await op.fn(...params);

        if (shouldQuit === true) {
            break;
        }

        if (i === currentI) {
            i += 1 + op.params + op.addrParams;
        }
    }

    return { newprogram: program, output };
};

module.exports = run;
