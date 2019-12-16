const getPattern = (index, count) => {
    const pattern = [];
    const basePattern = [0, 1, 0, -1];
    let baseI = index === 0 ? 1 : 0;
    let baseCount = index === 0 ? 0 : 1;
    for (let i = 0; i < count; i++) {
        pattern.push(basePattern[baseI]);
        baseCount++;
        if (baseCount - 1 === index) {
            baseCount = 0;
            baseI++;
            if (baseI === basePattern.length) {
                baseI = 0;
            }
        }
    }
    return pattern;
};

const doFft = (input, offset = 0) => {
    const chars = input.split('').map(c => Number(c));
    let output = '';
    for (let j = offset; j < offset + 8; j++) {
        const index = j;
        const char = chars[j];

        const pattern = getPattern(index, input.length);
        const newChar = String(
            Math.abs(
                chars.reduce((total, mChar, mIndex) => {
                    return total + Number(mChar) * pattern[mIndex];
                }, 0)
            )
        );
        output += newChar[newChar.length - 1];
    }
    return output;
};

// after n/2, the answer is the sum of all chars after n
// so by calculating backwards and then reversing it simplifies the solution
const doFft2 = input => {
    const chars = input.split('').map(c => Number(c));
    let output = '';
    let total = 0;
    for (let j = chars.length - 1; j >= 0; j--) {
        total += chars[j];
        output += String(Math.abs(total % 10));
    }
    return output
        .split('')
        .reverse()
        .join('');
};

module.exports = (input, phases, isPart2) => {
    const offset = Number(input.slice(0, 7));

    if (isPart2) {
        input = input.repeat(10000).substr(offset);
        for (let i = 0; i < phases; i++) {
            console.log('doing phase', i);
            input = doFft2(input);
        }
        return input.substr(0, 8);
    }

    for (let i = 0; i < phases; i++) {
        input = doFft(input);
    }

    if (isPart2) {
        return input.slice(offset, offset + 8);
    }
    return input;
};
