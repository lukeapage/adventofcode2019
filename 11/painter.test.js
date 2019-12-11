const input = require('./input');
const painter = require('./painter');

test('real', async () => {
    expect(await painter(input)).toMatchInlineSnapshot(`
        Object {
          "painted": 249,
          "printed": "

                                  █    ███  ████ █  █ █     ██  █  █ ███   
                                  █    █  █    █ █ █  █    █  █ █  █ █  █   
                                  █    █  █   █  ██   █    █    ████ █  █   
                                  █    ███   █   █ █  █    █ ██ █  █ ███   
                                  █    █    █    █ █  █    █  █ █  █ █ █  
                                  ████ █    ████ █  █ ████  ███ █  █ █  █ 
        ",
        }
    `);
});
