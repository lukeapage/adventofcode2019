const processor = require('../09/processor');
const program = require('./input');

module.exports = async input => {
    let i = 0;
    let outText = '';
    let damage;
    await processor(
        program,
        () => {
            return input.charCodeAt(i++);
        },
        output => {
            if (output > 255) {
                damage = output;
            } else {
                outText += String.fromCharCode(output);
            }
        }
    );

    return {
        outText,
        damage,
    };
};
