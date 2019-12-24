const gameoflife = require('./gameoflife');

test('part 1', () => {
    expect(gameoflife.part1()).toMatchInlineSnapshot(`18401265`);
});

test('part 2', () => {
    expect(gameoflife.part2()).toMatchInlineSnapshot(`2078`);
});

test('example 1', () => {
    expect(gameoflife.example1()).toMatchInlineSnapshot(`99`);
});

const present = maps => {
    return maps.map(map => {
        let presentation = '\n';
        map.forEach(xArray => {
            xArray.forEach(c => (presentation += c));
            presentation += '\n';
        });
        return presentation;
    });
};

test('detail 1', () => {
    expect(
        present(
            gameoflife.doPart2(
                `
    .....
    ..#..
    .#?#.
    ..#..
    .....
    `,
                1
            )
        )
    ).toMatchInlineSnapshot(`
        Array [
          "
        .....
        .....
        ..?..
        .....
        .....
        ",
          "
        ..#..
        .#.#.
        #.?.#
        .#.#.
        ..#..
        ",
          "
        #####
        #...#
        #.?.#
        #...#
        #####
        ",
          "
        .....
        .....
        ..?..
        .....
        .....
        ",
        ]
    `);
});

test('detail 2', () => {
    expect(
        present(
            gameoflife.doPart2(
                `
    ..#..
    .....
    #.?.#
    .....
    ..#..
    `,
                1
            )
        )
    ).toMatchInlineSnapshot(`
        Array [
          "
        .....
        .....
        ..?..
        .....
        .....
        ",
          "
        .....
        ..#..
        .#?#.
        ..#..
        .....
        ",
          "
        .#.#.
        #.#.#
        .#?#.
        #.#.#
        .#.#.
        ",
          "
        .....
        .....
        ..?..
        .....
        .....
        ",
        ]
    `);
});

test('detail 3', () => {
    expect(
        present(
            gameoflife.doPart2(
                `
    .###.
    #...#
    #.?.#
    #...#
    .###.
    `,
                1
            )
        )
    ).toMatchInlineSnapshot(`
        Array [
          "
        .....
        .....
        ..?..
        .....
        .....
        ",
          "
        ##.##
        #####
        .#?#.
        #####
        ##.##
        ",
          "
        .....
        .....
        ..?..
        .....
        .....
        ",
        ]
    `);
});

test('detail 4 - example 1', () => {
    expect(
        present(
            gameoflife.doPart2(
                `
....#
#..#.
#.?##
..#..
#....
    `,
                10
            )
        )
    ).toMatchInlineSnapshot(`
        Array [
          "
        .....
        .....
        ..?..
        .....
        .....
        ",
          "
        ..#..
        .#.#.
        ..?.#
        .#.#.
        ..#..
        ",
          "
        ...#.
        ...##
        ..?..
        ...##
        ...#.
        ",
          "
        #.#..
        .#...
        ..?..
        .#...
        #.#..
        ",
          "
        .#.##
        ....#
        ..?.#
        ...##
        .###.
        ",
          "
        #..##
        ...##
        ..?..
        ...#.
        .####
        ",
          "
        .#...
        .#.##
        .#?..
        .....
        .....
        ",
          "
        .##..
        #..##
        ..?.#
        ##.##
        #####
        ",
          "
        ###..
        ##.#.
        #.?..
        .#.##
        #.#..
        ",
          "
        ..###
        .....
        #.?..
        #....
        #...#
        ",
          "
        .###.
        #..#.
        #.?..
        ##.#.
        .....
        ",
          "
        ####.
        #..#.
        #.?#.
        ####.
        .....
        ",
          "
        .....
        .....
        ..?..
        .....
        .....
        ",
        ]
    `);
});
