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

const doFft = input => {
    const chars = input.split('');
    return chars
        .map((char, index) => {
            if (index % 10 === 0) {
                console.log('getting char', index);
            }
            const pattern = getPattern(index, input.length);
            const newChar = String(
                Math.abs(
                    chars.reduce((total, mChar, mIndex) => {
                        return total + Number(mChar) * pattern[mIndex];
                    }, 0)
                )
            );
            return newChar[newChar.length - 1];
        })
        .join('');
};

module.exports = (input, phases, isPart2) => {
    const offset = input.slice(0, 7);

    if (isPart2) {
        input = input.repeat(10000);
    }

    for (let i = 0; i < phases; i++) {
        console.log('doing phase', i);
        input = doFft(input);
    }

    if (isPart2) {
        return input.slice(offset, offset + 8);
    }
    return input;
};
