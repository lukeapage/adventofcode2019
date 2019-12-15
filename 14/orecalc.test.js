const orecalc = require('./orecalc');
const input = require('./input');

test('example 1', () => {
    expect(
        orecalc(`
9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL    
    `)
    ).toEqual(165);
});

test('part 1', () => {
    expect(orecalc(input)).toMatchInlineSnapshot(`843220`);
});

test('part 2', () => {
    expect(orecalc(input, 1000000000000)).toMatchInlineSnapshot(`2169535`);
});
