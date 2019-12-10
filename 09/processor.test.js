const processor = require('./processor');
const input = require('./input');

test('passes example 1', async () => {
    expect(await processor([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50])).toEqual(
        {
            newprogram: [3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50],
            output: undefined,
        }
    );
});

test('passes example 2', async () => {
    expect(await processor([3, 0, 4, 0, 99], 77)).toEqual({
        newprogram: [77, 0, 4, 0, 99],
        output: 77,
    });
});

test('passes example 3', async () => {
    expect(await processor([1002, 4, 3, 4, 33])).toEqual({
        newprogram: [1002, 4, 3, 4, 99],
        output: undefined,
    });
});

test('passes example 4', async () => {
    expect(
        (await processor([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], 8)).output
    ).toEqual(1);
    expect(
        (await processor([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], 7)).output
    ).toEqual(0);
});

test('passes example 5', async () => {
    expect(
        (await processor([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], 8)).output
    ).toEqual(0);
    expect(
        (await processor([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], 7)).output
    ).toEqual(1);
});

test('passes example 6', async () => {
    expect(
        (await processor([3, 3, 1108, -1, 8, 3, 4, 3, 99], 8)).output
    ).toEqual(1);
    expect(
        (await processor([3, 3, 1108, -1, 8, 3, 4, 3, 99], 7)).output
    ).toEqual(0);
});

test('passes example 7', async () => {
    expect(
        (await processor([3, 3, 1107, -1, 8, 3, 4, 3, 99], 8)).output
    ).toEqual(0);
    expect(
        (await processor([3, 3, 1107, -1, 8, 3, 4, 3, 99], 7)).output
    ).toEqual(1);
});

test('passes example 8', async () => {
    expect(
        (
            await processor(
                [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9],
                0
            )
        ).output
    ).toEqual(0);
    expect(
        (
            await processor(
                [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9],
                7
            )
        ).output
    ).toEqual(1);
});

test('passes example 9', async () => {
    expect(
        (await processor([3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1], 0))
            .output
    ).toEqual(0);
    expect(
        (await processor([3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1], 7))
            .output
    ).toEqual(1);
});

test('passes example 10', async () => {
    expect(
        (await processor([3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1], 0))
            .output
    ).toEqual(0);
    expect(
        (await processor([3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1], 7))
            .output
    ).toEqual(1);
});

test('passes example 11', async () => {
    expect(
        (
            await processor(
                [
                    3,
                    21,
                    1008,
                    21,
                    8,
                    20,
                    1005,
                    20,
                    22,
                    107,
                    8,
                    21,
                    20,
                    1006,
                    20,
                    31,
                    1106,
                    0,
                    36,
                    98,
                    0,
                    0,
                    1002,
                    21,
                    125,
                    20,
                    4,
                    20,
                    1105,
                    1,
                    46,
                    104,
                    999,
                    1105,
                    1,
                    46,
                    1101,
                    1000,
                    1,
                    20,
                    4,
                    20,
                    1105,
                    1,
                    46,
                    98,
                    99,
                ],
                7
            )
        ).output
    ).toEqual(999);
    expect(
        (
            await processor(
                [
                    3,
                    21,
                    1008,
                    21,
                    8,
                    20,
                    1005,
                    20,
                    22,
                    107,
                    8,
                    21,
                    20,
                    1006,
                    20,
                    31,
                    1106,
                    0,
                    36,
                    98,
                    0,
                    0,
                    1002,
                    21,
                    125,
                    20,
                    4,
                    20,
                    1105,
                    1,
                    46,
                    104,
                    999,
                    1105,
                    1,
                    46,
                    1101,
                    1000,
                    1,
                    20,
                    4,
                    20,
                    1105,
                    1,
                    46,
                    98,
                    99,
                ],
                8
            )
        ).output
    ).toEqual(1000);
    expect(
        (
            await processor(
                [
                    3,
                    21,
                    1008,
                    21,
                    8,
                    20,
                    1005,
                    20,
                    22,
                    107,
                    8,
                    21,
                    20,
                    1006,
                    20,
                    31,
                    1106,
                    0,
                    36,
                    98,
                    0,
                    0,
                    1002,
                    21,
                    125,
                    20,
                    4,
                    20,
                    1105,
                    1,
                    46,
                    104,
                    999,
                    1105,
                    1,
                    46,
                    1101,
                    1000,
                    1,
                    20,
                    4,
                    20,
                    1105,
                    1,
                    46,
                    98,
                    99,
                ],
                9
            )
        ).output
    ).toEqual(1001);
});

test('day 9 example 1', async () => {
    expect(
        (
            await processor([
                109,
                1,
                204,
                -1,
                1001,
                100,
                1,
                100,
                1008,
                100,
                16,
                101,
                1006,
                101,
                0,
                99,
            ])
        ).output
    ).toEqual([
        109,
        1,
        204,
        -1,
        1001,
        100,
        1,
        100,
        1008,
        100,
        16,
        101,
        1006,
        101,
        0,
        99,
    ]);
});

test('day 9 example 2', async () => {
    expect(
        (await processor([1102, 34915192, 34915192, 7, 4, 7, 99, 0])).output
    ).toMatchInlineSnapshot(`1219070632396864`);
});

test('day 9 example 3', async () => {
    expect((await processor([104, 1125899906842624, 99])).output).toEqual(
        1125899906842624
    );
});

test('day 9 part 1', async () => {
    expect((await processor(input, 1)).output).toMatchInlineSnapshot(
        `2436480432`
    );
});

test('day 9 part 2', async () => {
    expect((await processor(input, 2)).output).toMatchInlineSnapshot(`45710`);
});
