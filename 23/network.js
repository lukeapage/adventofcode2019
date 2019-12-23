const processor = require('./processor');
const program = require('./input');

const computer = (id, send) => {
    const inputQueue = [id];
    const outputQueue = [];
    processor(
        program,
        () => {
            return Promise.resolve(
                inputQueue.length > 0 ? inputQueue.shift() : -1
            );
        },
        output => {
            outputQueue.push(output);
            if (outputQueue.length === 3) {
                send(...outputQueue);
                outputQueue.length = 0;
            }
        }
    );

    return (...msgs) => {
        msgs.forEach(m => inputQueue.push(m));
    };
};

module.exports = () => {
    console.log('starting network...');
    return new Promise(resolve => {
        const computers = [];
        const preBootMessages = [];
        const send = (addr, x, y) => {
            console.log('sending to', addr);
            if (addr === 255) {
                console.log('resolving...');
                resolve(y);
                computers.forEach(computer => computer('QUIT'));
                return;
            }
            if (!computers[addr]) {
                if (!preBootMessages[addr]) {
                    preBootMessages[addr] = [];
                }
                preBootMessages[addr].push(x);
                preBootMessages[addr].push(y);
            } else {
                computers[addr](x, y);
            }
        };
        for (let i = 0; i < 50; i++) {
            computers[i] = computer(i, send);
            if (preBootMessages[i]) {
                computers[i](...preBootMessages[i]);
            }
        }
    });
};
