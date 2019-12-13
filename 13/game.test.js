const game = require('./game');

test('part 1', async () => {
    expect(await game(1)).toMatchInlineSnapshot(`296`);
});

test('part 2', async () => {
    expect(await game(2)).toMatchInlineSnapshot(`13824`);
});
