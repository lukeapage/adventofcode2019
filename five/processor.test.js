const processor = require('./processor');
const input = require('./input');

test('passes example 1', () => {
    expect(processor([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50])).toEqual({
        newprogram: [3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50],
        output: undefined,
    });
});

test('passes example 2', () => {
    expect(processor([3, 0, 4, 0, 99], 77)).toEqual({
        newprogram: [77, 0, 4, 0, 99],
        output: 77,
    });
});

test('passes example 3', () => {
    expect(processor([1002, 4, 3, 4, 33])).toEqual({
        newprogram: [1002, 4, 3, 4, 99],
        output: undefined,
    });
});

test('real part 1', () => {
    expect(processor(input, 1).output).toMatchInlineSnapshot(`15386262`);
});

test('passes example 4', () => {
    expect(processor([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], 8).output).toEqual(
        1
    );
    expect(processor([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], 7).output).toEqual(
        0
    );
});

test('passes example 5', () => {
    expect(processor([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], 8).output).toEqual(
        0
    );
    expect(processor([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], 7).output).toEqual(
        1
    );
});

test('passes example 6', () => {
    expect(processor([3, 3, 1108, -1, 8, 3, 4, 3, 99], 8).output).toEqual(1);
    expect(processor([3, 3, 1108, -1, 8, 3, 4, 3, 99], 7).output).toEqual(0);
});

test('passes example 7', () => {
    expect(processor([3, 3, 1107, -1, 8, 3, 4, 3, 99], 8).output).toEqual(0);
    expect(processor([3, 3, 1107, -1, 8, 3, 4, 3, 99], 7).output).toEqual(1);
});

test('passes example 8', () => {
    expect(
        processor([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], 0)
            .output
    ).toEqual(0);
    expect(
        processor([3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9], 7)
            .output
    ).toEqual(1);
});

test('passes example 9', () => {
    expect(
        processor([3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1], 0).output
    ).toEqual(0);
    expect(
        processor([3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1], 7).output
    ).toEqual(1);
});

test('passes example 10', () => {
    expect(
        processor([3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1], 0).output
    ).toEqual(0);
    expect(
        processor([3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1], 7).output
    ).toEqual(1);
});

test('passes example 11', () => {
    expect(
        processor(
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
        ).output
    ).toEqual(999);
    expect(
        processor(
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
        ).output
    ).toEqual(1000);
    expect(
        processor(
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
        ).output
    ).toEqual(1001);
});

test('part 2', () => {
    expect(processor(input, 5).output).toMatchInlineSnapshot(`10376124`);
});
