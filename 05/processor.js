let debug = (...args) => {
    false && console.log(...args);
};

const getParam = (program, i, modes, offset) => {
    const mode = modes[offset - 1] || 0;
    const val = program[i + offset];
    if (mode === 0) {
        return program[val];
    } else if (mode === 1) {
        return val;
    } else {
        throw new Error('invalid mode');
    }
};

const run = (program, input) => {
    if (!Array.isArray(input)) {
        input = [input];
    } else {
        input = input.slice(0);
    }
    let output;
    program = program.slice(0);
    let increment;
    for (let i = 0; i < program.length; i += increment) {
        let instr = program[i];
        const opcode = Number(String(instr).slice(-2));
        const modes = String(instr)
            .slice(0, -2)
            .split('')
            .reverse()
            .map(Number);
        if (opcode === 99) break;

        if (opcode === 1 || opcode === 2 || opcode === 7 || opcode === 8) {
            let a = getParam(program, i, modes, 1),
                b = getParam(program, i, modes, 2),
                pos = program[i + 3];

            if (opcode === 1) {
                program[pos] = a + b;
            } else if (opcode === 2) {
                program[pos] = a * b;
            } else if (opcode === 7) {
                debug('LT', a, b, pos);
                program[pos] = a < b ? 1 : 0;
            } else {
                debug('EQ', a, b, pos);
                program[pos] = a === b ? 1 : 0;
            }
            increment = 4;

            continue;
        }
        if (opcode === 3 || opcode === 4) {
            if (opcode === 3) {
                if (input.length == 0) {
                    throw new Error('not enough input provided');
                }
                const curInput = input.shift();
                debug('input', program[i + 1], curInput);
                program[program[i + 1]] = curInput;
            } else {
                debug('output', getParam(program, i, modes, 1));
                output = getParam(program, i, modes, 1);
            }
            increment = 2;
            continue;
        }
        if (opcode === 5 || opcode === 6) {
            let a = getParam(program, i, modes, 1),
                b = getParam(program, i, modes, 2);

            if (opcode === 5) {
                if (a !== 0) {
                    i = b - 3;
                }
            } else {
                if (a === 0) {
                    i = b - 3;
                }
            }
            increment = 3;
            continue;
        }
        throw new Error(`invalid opcode ${opcode} from ${instr}`);
    }
    return { newprogram: program, output };
};

module.exports = run;
