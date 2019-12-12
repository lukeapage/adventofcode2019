const maporbits = require('./maporbits');

test('example 1', () => {
    expect(
        maporbits(
            `
    <x=-1, y=0, z=2>
    <x=2, y=-10, z=-7>
    <x=4, y=-8, z=8>
    <x=3, y=5, z=-1>
    `,
            1,
            'orbits'
        )
    ).toMatchInlineSnapshot(`
        Array [
          Object {
            "position": Object {
              "x": 2,
              "y": -1,
              "z": 1,
            },
            "velocity": Object {
              "x": 3,
              "y": -1,
              "z": -1,
            },
          },
          Object {
            "position": Object {
              "x": 3,
              "y": -7,
              "z": -4,
            },
            "velocity": Object {
              "x": 1,
              "y": 3,
              "z": 3,
            },
          },
          Object {
            "position": Object {
              "x": 1,
              "y": -7,
              "z": 5,
            },
            "velocity": Object {
              "x": -3,
              "y": 1,
              "z": -3,
            },
          },
          Object {
            "position": Object {
              "x": 2,
              "y": 2,
              "z": 0,
            },
            "velocity": Object {
              "x": -1,
              "y": -3,
              "z": 1,
            },
          },
        ]
    `);

    expect(
        maporbits(
            `
    <x=-1, y=0, z=2>
    <x=2, y=-10, z=-7>
    <x=4, y=-8, z=8>
    <x=3, y=5, z=-1>
    `,
            2,
            'orbits'
        )
    ).toMatchInlineSnapshot(`
        Array [
          Object {
            "position": Object {
              "x": 5,
              "y": -3,
              "z": -1,
            },
            "velocity": Object {
              "x": 3,
              "y": -2,
              "z": -2,
            },
          },
          Object {
            "position": Object {
              "x": 1,
              "y": -2,
              "z": 2,
            },
            "velocity": Object {
              "x": -2,
              "y": 5,
              "z": 6,
            },
          },
          Object {
            "position": Object {
              "x": 1,
              "y": -4,
              "z": -1,
            },
            "velocity": Object {
              "x": 0,
              "y": 3,
              "z": -6,
            },
          },
          Object {
            "position": Object {
              "x": 1,
              "y": -4,
              "z": 2,
            },
            "velocity": Object {
              "x": -1,
              "y": -6,
              "z": 2,
            },
          },
        ]
    `);

    expect(
        maporbits(
            `
    <x=-1, y=0, z=2>
    <x=2, y=-10, z=-7>
    <x=4, y=-8, z=8>
    <x=3, y=5, z=-1>
    `,
            10,
            'energy'
        )
    ).toEqual(179);

    expect(
        maporbits(
            `
    <x=-1, y=0, z=2>
    <x=2, y=-10, z=-7>
    <x=4, y=-8, z=8>
    <x=3, y=5, z=-1>
    `,
            Infinity,
            'repeats'
        )
    ).toMatchInlineSnapshot(`
        Object {
          "answer": 2772,
          "data": Array [
            18,
            28,
            44,
          ],
          "gcd": 2,
        }
    `);
});

test('part 1', () => {
    expect(
        maporbits(
            `
    <x=-1, y=-4, z=0>
    <x=4, y=7, z=-1>
    <x=-14, y=-10, z=9>
    <x=1, y=2, z=17>
    `,
            1000,
            'energy'
        )
    ).toMatchInlineSnapshot(`7988`);
});

test('part 2', () => {
    expect(
        maporbits(
            `
    <x=-1, y=-4, z=0>
    <x=4, y=7, z=-1>
    <x=-14, y=-10, z=9>
    <x=1, y=2, z=17>
    `,
            Infinity,
            'repeats'
        )
    ).toMatchInlineSnapshot(`
        Object {
          "answer": 337721412394184,
          "data": Array [
            231614,
            193052,
            60424,
          ],
          "gcd": 2,
        }
    `);
});
