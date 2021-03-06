const joincalc = require('./joincalc');

test('drawmap', async () => {
    expect(await joincalc.getMap()).toMatchInlineSnapshot(`
        "..................#######................................
        ..................#.....#................................
        ..................#.....#................................
        ..................#.....#................................
        ..................#.....#................................
        ..................#.....#................................
        ..................#.....#................................
        ..................#.....#................................
        ..................##########^...................#########
        ........................#.......................#.......#
        ........................#############...........#.......#
        ....................................#...........#.......#
        ....................................#...........#.......#
        ....................................#...........#.......#
        ....................................#.........###########
        ....................................#.........#.#........
        ....................................#.........#.#........
        ....................................#.........#.#........
        ....................................#############........
        ..............................................#..........
        ..............................................#..........
        ..............................................#..........
        ..............................................#..........
        ..............................................#..........
        ..............................................#..........
        ..............................................#..........
        ......................................#########..........
        ......................................#..................
        ......................................#..................
        ......................................#..................
        ......................................#..................
        ......................................#..................
        ......................................#..................
        ......................................#..................
        ..........#########...................#..................
        ..........#.......#...................#..................
        ..........#.......#...................#..................
        ..........#.......#...................#..................
        ..........#.......#...................###########........
        ..........#.......#.............................#........
        ........############O.#.........................#........
        ........#.#.......O.O.#.........................#........
        ........#.#.......OOOOO######...................#........
        ........#.#.........#.#.....#...................#........
        ###########.........#.#.....#...................#........
        #.......#...........#.#.....#...................#........
        #.......#...........#.#.....#...........#########........
        #.......#...........#.#.....O...........#................
        #.......#...........########O####.......#................
        #.......#.............#.....#...#.......#................
        #########.............#######...#.......#................
        ................................#.......#................
        ................................#.......#................
        ................................#.......#................
        ................................#.......#................
        ................................#.......#................
        ................................#########................

        "
    `);
});

test('example 1', () => {
    expect(
        joincalc.mapToJoins(`
..#..........
..#..........
#######...###
#.#...#...#.#
#############
..#...#...#..
..#####...^..
    `)
    ).toEqual(76);
});

test('part 1', async () => {
    expect(joincalc.mapToJoins(await joincalc.getMap())).toMatchInlineSnapshot(
        `7328`
    );
});

test('part 2', async () => {
    expect(await joincalc.part2()).toMatchInlineSnapshot(`1289413`);
});

test('removeFromInstr', () => {
    expect(
        joincalc.removeFromInstr(['L', '12'], ['A', 'L', '12', 'B'])
    ).toEqual(['A', 'B']);
    expect(joincalc.removeFromInstr(['L', '12'], ['L', '12', 'B'])).toEqual([
        'B',
    ]);
});
