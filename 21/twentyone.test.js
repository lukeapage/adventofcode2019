const x = require('./twentyone');

test('example 1', async () => {
    expect(
        await x(`NOT D J
WALK
`)
    ).toMatchInlineSnapshot(`
        Object {
          "damage": undefined,
          "outText": "Input instructions:

        Walking...


        Didn't make it across:

        .................
        .................
        @................
        #####.###########

        .................
        .................
        .@...............
        #####.###########

        .................
        ..@..............
        .................
        #####.###########

        ...@.............
        .................
        .................
        #####.###########

        .................
        ....@............
        .................
        #####.###########

        .................
        .................
        .....@...........
        #####.###########

        .................
        .................
        .................
        #####@###########

        ",
        }
    `);
});

test('part 1', async () => {
    expect(
        await x(`NOT A T
NOT B J
OR T J
NOT C T
OR T J
AND D J
WALK
    `)
    ).toMatchInlineSnapshot(`
        Object {
          "damage": 19354928,
          "outText": "Input instructions:

        Walking...

        ",
        }
    `);
});

//..................
//.................
//..@..............
//#####.#.#...#####
//   ABCDEFG
//    ABCDEFG
//.................
//.................
//....@............
//#####.#..########
//   ABCDEF

//part 1 - (!A || !B) || !C && D
//
//!A || (!B && !E) || (!C && !F) && D
//!A || !(B || A) || !(C || F)
//!A || (!B && !E) || !(C || F) && D

//NOT B T
//NOT E J
//AND T J
//NOT A T
//OR T J

test('part 2', async () => {
    expect(
        await x(`NOT B J
OR T J
NOT C T
OR T J
NOT F T
NOT T T
OR I T
AND E T
OR H T
AND D T
AND T J
NOT A T
OR T J
RUN
`)
    ).toMatchInlineSnapshot(`
        Object {
          "damage": 1141997803,
          "outText": "Input instructions:

        Running...

        ",
        }
    `);
});
