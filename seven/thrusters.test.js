const { thrusters, thrusters2 } = require('./thrusters');
const input = require('./input');

test('example 3', () => {
    expect(
        thrusters([
            3,
            31,
            3,
            32,
            1002,
            32,
            10,
            32,
            1001,
            31,
            -2,
            31,
            1007,
            31,
            0,
            33,
            1002,
            33,
            7,
            33,
            1,
            33,
            31,
            31,
            1,
            32,
            31,
            31,
            4,
            31,
            99,
            0,
            0,
            0,
        ])
    ).toEqual(65210);
});

test('part 1', () => {
    expect(thrusters(input)).toMatchInlineSnapshot(`21000`);
});

test('example 5', async () => {
    expect(
        await thrusters2([
            3,
            52,
            1001,
            52,
            -5,
            52,
            3,
            53,
            1,
            52,
            56,
            54,
            1007,
            54,
            5,
            55,
            1005,
            55,
            26,
            1001,
            54,
            -5,
            54,
            1105,
            1,
            12,
            1,
            53,
            54,
            53,
            1008,
            54,
            0,
            55,
            1001,
            55,
            1,
            55,
            2,
            53,
            55,
            53,
            4,
            53,
            1001,
            56,
            -1,
            56,
            1005,
            56,
            6,
            99,
            0,
            0,
            0,
            0,
            10,
        ])
    ).toEqual(18216);
});

test('part 2', async () => {
    expect(await thrusters2(input)).toMatchInlineSnapshot(`61379886`);
});
