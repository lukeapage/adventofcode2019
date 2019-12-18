const vaultFinder = require('./vaultfinder2');
const input = require('./input2');

test('example 3', () => {
    expect(
        vaultFinder(`
        #############
        #g#f.D#..h#l#
        #F###e#E###.#
        #dCba$#%BcIJ#
        #############
        #nK.L@#^G...#
        #M###N#H###.#
        #o#m..#i#jk.#
        #############
    `)
    ).toEqual(72);
});

test('part 1', () => {
    expect(vaultFinder(input)).toMatchInlineSnapshot(`1692`);
});
