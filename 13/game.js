const input = require('./input');
const processor = require('../09/processor');

module.exports = async partNumber => {
    let outputInstr = [];
    let blocks = 0;
    let score = 0;
    const gameCode = input.slice(0);
    gameCode[0] = partNumber;
    let ballX = 0;
    let paddleX = 0;
    await processor(
        gameCode,
        () => {
            if (ballX === paddleX) return 0;
            if (ballX > paddleX) return 1;
            return -1;
        },
        output => {
            outputInstr.push(output);
            if (outputInstr.length === 3) {
                if (outputInstr[2] === 2) {
                    blocks++;
                }
                if (outputInstr[0] === -1 && outputInstr[1] === 0) {
                    score = outputInstr[2];
                    // console.log('received score', score);
                } else if (outputInstr[2] === 3) {
                    // paddle
                    paddleX = outputInstr[0];
                    // console.log('received paddle x', paddleX);
                } else if (outputInstr[2] === 4) {
                    // ball
                    ballX = outputInstr[0];
                    // console.log('received ball x', ballX);
                }
                outputInstr.length = 0;
            }
        }
    );

    return partNumber === 1 ? blocks : score;
};
