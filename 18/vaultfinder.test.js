const vaultFinder = require('./vaultfinder');
const input = require('./input');

test('example 1', () => {
    expect(
        vaultFinder(`
    #########
    #b.A.@.a#
    #########
    `)
    ).toEqual(8);
});

test('example 2', () => {
    expect(
        vaultFinder(`
    ########################
    #f.D.E.e.C.b.A.@.a.B.c.#
    ######################.#
    #d.....................#
    ########################
    `)
    ).toEqual(86);
});

test('example 3', () => {
    expect(
        vaultFinder(`
    ########################
    #...............b.C.D.f#
    #.######################
    #.....@.a.B.c.d.A.e.F.g#
    ########################
    `)
    ).toEqual(132);
});

test('example 4', () => {
    expect(
        vaultFinder(`
        #################
        #i.G..c...e..H.p#
        ########.########
        #j.A..b...f..D.o#
        ########@########
        #k.E..a...g..B.n#
        ########.########
        #l.F..d...h..C.m#
        #################
    `)
    ).toEqual(136);
});

test('example 5', () => {
    expect(
        vaultFinder(`
        ########################
        #@..............ac.GI.b#
        ###d#e#f################
        ###A#B#C################
        ###g#h#i################
        ########################
    `)
    ).toEqual(81);
});

test.only('part 1', () => {
    expect(vaultFinder(input)).toMatchInlineSnapshot(`4544`);
});
