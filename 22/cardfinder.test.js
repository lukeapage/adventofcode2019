const cardFinder = require('./cardfinder');
const input = require('./input');

const findAllCards = (length, ops) => {
    return new Array(length).fill(0).map((_, i) => {
        return cardFinder(length, ops, i);
    });
};

test('example 1', () => {
    expect(
        findAllCards(
            10,
            `
            deal with increment 7
            deal into new stack
            deal into new stack
`
        )
    ).toEqual('0 3 6 9 2 5 8 1 4 7'.split(' ').map(n => Number(n)));
});

test('cut', () => {
    expect(
        findAllCards(
            10,
            `
            cut 3
            `
        )
    ).toEqual('3 4 5 6 7 8 9 0 1 2'.split(' ').map(n => Number(n)));
    expect(
        findAllCards(
            10,
            `
            cut 6
            `
        )
    ).toEqual('6 7 8 9 0 1 2 3 4 5'.split(' ').map(n => Number(n)));
});

test('cut neg', () => {
    expect(
        findAllCards(
            10,
            `
            cut -4
            `
        )
    ).toEqual('6 7 8 9 0 1 2 3 4 5'.split(' ').map(n => Number(n)));
});

test('dis', () => {
    expect(
        findAllCards(
            10,
            `
            deal into new stack
            `
        )
    ).toEqual('9 8 7 6 5 4 3 2 1 0'.split(' ').map(n => Number(n)));
});

test('example 2', () => {
    expect(
        findAllCards(
            10,
            `
            cut 6
            deal with increment 7
            deal into new stack
            `
        )
    ).toEqual('3 0 7 4 1 8 5 2 9 6'.split(' ').map(n => Number(n)));
});

test('example 5', () => {
    expect(
        findAllCards(
            10,
            `
    deal into new stack
    cut -2
    deal with increment 7
    cut 8
    cut -4
    deal with increment 7
    cut 3
    deal with increment 9
    deal with increment 3
    cut -1
`
        )
    ).toEqual('9 2 5 8 1 4 7 0 3 6'.split(' ').map(n => Number(n)));
});

test('part 1', () => {
    let i;
    for (i = 0; i < 10007; i++) {
        if (cardFinder(10007, input, i) === 2019) {
            break;
        }
    }
    expect(i).toMatchInlineSnapshot(`6061`);
});

test('part 2', () => {
    expect(
        cardFinder(119315717514047, input, 2020, 101741582076661)
    ).toMatchInlineSnapshot(`undefined`);
});
