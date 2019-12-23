const operations = [
    {
        getArg() {},
        isMatch: str => str.match(/deal into new stack/),
        do(_, currentCardPos, count) {
            return count - 1 - currentCardPos;
        },
    },
    {
        isMatch: str => str.match(/cut/),
        getArg(str) {
            return Number(str.match(/cut (-?\d+)/)[1]);
        },
        do(n, currentCardPos, count) {
            if (n > 0) {
                if (currentCardPos - count + n >= 0) {
                    return currentCardPos - count + n;
                } else {
                    return currentCardPos + n;
                }
            } else {
                if (currentCardPos < -n) {
                    return currentCardPos + (count + n);
                } else {
                    return currentCardPos + n;
                }
            }
        },
    },
    {
        isMatch: str => str.match(/deal with increment/),
        getArg(str) {
            return Number(str.match(/deal with increment (\d+)/)[1]);
        },
        do(n, currentCardPos, count) {
            let i = 0;
            let remainderFromLast = 0;
            let lastFit = 0;
            false && console.log('into dwi - ', n, 'currently', currentCardPos);
            while (i <= n) {
                false &&
                    console.log(
                        'iteration',
                        i,
                        'remainder adding last',
                        (currentCardPos + remainderFromLast) % n
                    );
                if ((currentCardPos + remainderFromLast) % n === 0) {
                    return lastFit + (currentCardPos + remainderFromLast) / n;
                }
                i++;
                lastFit +=
                    (lastFit === 0 ? -1 : 0) +
                    Math.ceil((count - (n - remainderFromLast)) / n);
                remainderFromLast = count - ((lastFit * n) % count);
                false &&
                    console.log(
                        'last fit',
                        lastFit,
                        'remainder from last',
                        remainderFromLast
                    );
            }
            throw new Error(`dwi failure, ${currentCardPos}, ${n}, ${count}`);
        },
    },
];

module.exports = (noCards, opList, cardToFind, countOfOps = 1) => {
    opList = opList
        .trim()
        .split('\n')
        .reverse()
        .map(opStr => {
            const operation = operations.find(op => op.isMatch(opStr));
            if (!operation) {
                throw new Error('could not find operation');
            }
            return { ...operation, arg: operation.getArg(opStr) };
        });

    const timeStart = Date.now();

    //const seq = [];
    for (let i = 0; i < countOfOps; i++) {
        //if (i === 10000) {
        //    console.log(
        //        ((Date.now() - timeStart) * (countOfOps / 10000)) /
        //            (1000 * 60 * 60),
        //        'hours to finish'
        //    );
        //    console.log(seq);
        //    return;
        //}
        for (let j = 0; j < opList.length; j++) {
            cardToFind = opList[j].do(opList[j].arg, cardToFind, noCards);
            // console.log('new one - ', cardToFind);
            if (cardToFind < 0 || cardToFind >= noCards) {
                throw new Error(`failure! ${cardToFind}`);
            }
        }
        //seq.push(cardToFind);
        if (cardToFind === 2020) {
            console.log('repeats', i);
            return;
        }
    }
    return cardToFind;
};
