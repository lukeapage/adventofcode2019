const operations = [
    {
        isMatch: str => str.match(/deal into new stack/),
        do(str, currentCardPos, count) {
            // 9 -> 0
            // 0 -> 9
            return count - 1 - currentCardPos;
        },
    },
    {
        isMatch: str => str.match(/cut/),
        do(str, currentCardPos, count) {
            const n = Number(str.match(/cut (-?\d+)/)[1]);
            // console.log('cut', n, '/', count);
            if (n > 0) {
                // 123
                // 231
                // 9 with cut 3 becomes 2
                // 7 with cut 3 becomes 0
                if (currentCardPos - count + n >= 0) {
                    return currentCardPos - count + n;
                } else {
                    // 0 with cut 3 becomes 3
                    return currentCardPos + n;
                }
            } else {
                if (currentCardPos < -n) {
                    // 0 -> 7
                    // 2 -> 9
                    return currentCardPos + (count + n);
                } else {
                    // 0 with cut 3 becomes 3
                    return currentCardPos + n;
                }
            }
        },
    },
    {
        isMatch: str => str.match(/deal with increment/),
        do(str, currentCardPos, count) {
            const n = Number(str.match(/deal with increment (\d+)/)[1]);
            let i = 0;
            while ((i * n) % count !== currentCardPos && i < count) {
                i++;
            }
            if ((i * n) % count !== currentCardPos) {
                throw new Error('dwi failure', currentCardPos, n, count);
            }
            return i;
        },
    },
];

module.exports = (noCards, opList, cardToFind) => {
    opList = opList
        .trim()
        .split('\n')
        .reverse();
    opList.map(opStr => {
        const operation = operations.find(op => op.isMatch(opStr));
        if (!operation) {
            throw new Error('could not find operation');
        }
        cardToFind = operation.do(opStr, cardToFind, noCards);
        // console.log('new one - ', cardToFind);
        if (cardToFind < 0) {
            throw new Error(`failure! ${cardToFind}`);
        }
    });
    return cardToFind;
};
