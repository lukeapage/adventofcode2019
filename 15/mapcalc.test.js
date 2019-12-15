const mapcalc = require('./mapcalc');

test('part 1', async () => {
    expect(await mapcalc()).toMatchInlineSnapshot(`
        Object {
          "distance": 234,
          "minutesForOxygen": 292,
          "printed": "
                                      ███ ███████ █████████ ███████████ ███ █
                                     █...█.......█.........█...........█...█.█
                                     █.█.███.█.███.███.███.███.█.█████.█.█.█.█
                                     █.█...█.█.......█.█.....█.█.█.....█.█.█.█
                                     █.███.█████████.█.█████.███.█.█████.█.█.█
                                     █.█O█.█.....█...█...█.......█.█...█.█.█.█
                                     █.█.█.█.███.███████.█████████.█.█.█.█.█.█
                                     █.█.....█.█...█...█...█.....█...█...█.█.█
                                     █.███████.███.█.█.███.█.█.██████ ████.█.█
                                     █.......█...█...█.█...█.█.......█...█...█
                                     █.█████.█.███████.█.██ ████.█████.█.███.█
                                     █.█...█.█.........█...█...█.......█...█.█
                                     █.███.█.███.█████████.█.█.███.█████.█.█.█
                                     █.....█...█.█...█.....█.█...█.....█.█.█.█
                                      ████.███.█.█.█.███.█.█.███.███████.█.█.█
                                     █.....█...█...█.....█.█.█.█...█.....█.█.█
                                     █.█████.██ ████.████ ██.█.███.█.███████.█
                                     █.█...█...█.....█...█...█.█...█.█.......█
                                     █.███.███.███.███.█.█.███.█.███.█.██████
                                     █.......█...█.█...█...█...█...█.█.....█.█
                                     █.██████ ██.█.█.███████.█████.█.█████.█.█
                                     █.█.....█...█.█......██.█.....█.█.....█.█
                                      ██.███.█.███.█████████.█.█████.█.█████.█
                                     █...█...█.█.█...█...█...█.....█.█.█...█.█
                                     █.███.███.█.█.███.█.█.█.█████.█.█.█.█.█.█
                                     █.█.......█...█...█...█.....█.█.█...█.█.█
                                     █.█████████.███.██████ ████.█.█.█████.█.█
                                     █.█.....█...█.█.█.....█...█...█.....█.█.█
                                     █.█.███.█.███.█.█.█.███.█.█████.███.█.█.█
                                     █.█.█.█.█.█...█.█.█.█...█.....█.█...█...█
                                     █.█.█.█.█.███.█.███.█.█████.█.█.█.█████.█
                                     █.█...█.█...█.█...█.......█.█.█.█.█.....█
                                     █.█.███.███.█.███.███████.█.█.███.█.████
                                     █.█.█...█.......█...█.....█.█.█...█.█...█
                                     █.█.█.█████.████ ██.█.█████.█.█.█.█.█.█.█
                                     █...█.█...█.█...█...█.█.█...█...█.█.█.█.█
                                      ████.█.█.███.█.█.███.█.█.██ ████X█.███.█
                                     █...█...█.....█...█.█...█...█...█.█...█.█
                                     █.█.███████████████.███.███.█.█.█████.█.█
                                     █.█.......................█...█.........█
                                      █ ███████████████████████ ███ █████████
        ",
        }
    `);
});
