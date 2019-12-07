const orbitcounter = require('./orbitcounter');
const input = require('./input');
test('example 1', () => {
    expect(
        orbitcounter([
            'COM)B',
            'C)D',
            'B)C',
            'D)E',
            'E)F',
            'B)G',
            'G)H',
            'D)I',
            'E)J',
            'J)K',
            'K)L',
        ])
    ).toBe(42);
});

test('example 2', () => {
    expect(orbitcounter(['COM)B', 'C)D', 'C)E', 'B)C'])).toBe(9);
});

test('part 1', () => {
    expect(orbitcounter(input)).toMatchInlineSnapshot(`162439`);
});

test('example 3', () => {
    expect(
        orbitcounter(
            [
                'COM)B',
                'B)C',
                'C)D',
                'D)E',
                'E)F',
                'B)G',
                'G)H',
                'D)I',
                'E)J',
                'J)K',
                'K)L',
                'K)YOU',
                'I)SAN',
            ],
            'YOU',
            'SAN'
        )
    ).toBe(4);
});

test('part 2', () => {
    expect(orbitcounter(input, 'YOU', 'SAN')).toMatchInlineSnapshot(`367`);
});
