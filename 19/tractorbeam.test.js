const tractorbeam = require('./tractorbeam');

test('part 1', async () => {
    expect(await tractorbeam()).toMatchInlineSnapshot(`171`);
});

test('part 2', async () => {
    expect(await tractorbeam(2)).toMatchInlineSnapshot(`9741242`);
});
