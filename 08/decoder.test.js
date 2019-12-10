const decoder = require('./decoder');
const input = require('./input');

test('part 1 & 2', () => {
    expect(decoder(input, 25, 6)).toMatchInlineSnapshot(`
        Object {
          "checksum": 2975,
          "image": "
        0000 0  0 000  0  0 0000 
        0    0  0 0  0 0  0 0    
        000  0000 0  0 0  0 000  
        0    0  0 000  0  0 0    
        0    0  0 0 0  0  0 0    
        0000 0  0 0  0  00  0000 
        ",
        }
    `);
    //  E    H    R    U    E
});
