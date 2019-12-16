const fft = require('./fft');
const input = require('./input');

test('example 1', () => {
    expect(fft('12345678', 1)).toEqual('48226158');
    expect(fft('12345678', 2)).toEqual('34040438');
});

test('part 1', () => {
    expect(fft(input, 100).slice(0, 8)).toMatchInlineSnapshot(`"28430146"`);
});

test.only('part 2', () => {
    expect(fft(input, 100, true)).toMatchInlineSnapshot();
});
