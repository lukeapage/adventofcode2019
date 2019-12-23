const network = require('./network');
const network2 = require('./network2');

test('part 1', async () => {
    expect(await network()).toMatchInlineSnapshot(`27061`);
});

test('part 2', async () => {
    expect(await network2()).toMatchInlineSnapshot(`19406`);
});
