const processor = require('./processor');
const program = require('./input');

const computer = (id, send) => {
    const inputQueue = [id];
    const outputQueue = [];
    let noEmptyInputs = 0;
    const returnedComputer = {
        isIdle: false,
        send(...msgs) {
            returnedComputer.isIdle = false;
            msgs.forEach(m => inputQueue.push(m));
        },
    };

    processor(
        program,
        () => {
            if (inputQueue.length === 0) {
                noEmptyInputs++;
                if (noEmptyInputs === 2) {
                    returnedComputer.isIdle = true;
                }
                return -1;
            }
            noEmptyInputs = 0;
            return inputQueue.shift();
        },
        output => {
            noEmptyInputs = 0;
            returnedComputer.isIdle = false;
            outputQueue.push(output);
            if (outputQueue.length === 3) {
                send(...outputQueue);
                outputQueue.length = 0;
            }
        }
    );

    return returnedComputer;
};

module.exports = () => {
    console.log('starting network...');
    let natx, naty;
    let lastSendNatY;
    return new Promise(resolve => {
        const computers = [];
        const nat = async () => {
            while (true) {
                if (
                    !computers.some(computer => {
                        return !computer.isIdle;
                    })
                ) {
                    console.log('idle!');
                    if (naty === lastSendNatY) {
                        console.log('resolving...', naty);
                        resolve(naty);
                        computers.forEach(computer => computer.send('QUIT'));
                        return;
                    }
                    lastSendNatY = naty;
                    send(0, natx, naty);
                }
                await Promise.resolve();
            }
        };
        const send = (addr, x, y) => {
            // console.log('sending to', addr);
            if (addr === 255) {
                // console.log('sending to nat');
                natx = x;
                naty = y;
                return;
            }
            if (computers[addr]) {
                computers[addr].send(x, y);
            } else {
                throw new Error(
                    `computer not started or does not exist ${addr}`
                );
            }
        };
        for (let i = 0; i < 50; i++) {
            computers[i] = computer(i, send);
        }

        nat();
    });
};
