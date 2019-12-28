const processor = require('../09/processor');
const game = require('./input');
const PromptInput = require('prompt-input');

let input = `north
take sand
north
north
take astrolabe
south
south
west
west
take mutex
east
east
south
east
take klein bottle
east
take semiconductor
west
north
north
north
take dehydrated water
south
south
south
west
west
north
take shell
south
south
east
south
north
west
west
take ornament
west
south
inv
`
    .split('')
    .map(c => c.charCodeAt(0));

let lastOutput = '';
let hasEntered = false;
let items;
let takeDropCommands;

const tryWeights = items => {
    const tries = [];
    let leftOverDropped = '';
    for (let i = 150; i <= Math.pow(2, items.length); i++) {
        let command = '';
        if (leftOverDropped) {
            command += leftOverDropped;
        }
        for (let j = 0; j < items.length; j++) {
            if (Math.pow(2, j) & i) {
                command += 'drop ' + items[j] + '\n';
                leftOverDropped += 'take ' + items[j] + '\n';
            }
        }
        command += 'south\n';
        tries.push(command);
    }
    tries.push(leftOverDropped + 'south\n');
    return tries;
};

let doOutput = true;

processor(
    game,
    () => {
        if (input.length === 0 && !hasEntered) {
            if (
                items &&
                lastOutput.indexOf(
                    'Alert! Droids on this ship are lighter than the detected value!'
                ) < 0 &&
                lastOutput.indexOf(
                    'Alert! Droids on this ship are heavier than the detected value!'
                ) < 0
            ) {
                console.log('entered!', 255 - takeDropCommands.length);
                console.log(lastOutput);
                doOutput = true;
                hasEntered = true;
            } else {
                if (!items) {
                    items = lastOutput
                        .split('Items in your inventory:')[1]
                        .trim()
                        .split('\n')
                        .map(itemStr => itemStr.split('- ')[1])
                        .filter(item => Boolean(item));

                    takeDropCommands = tryWeights(items);
                }

                if (takeDropCommands.length === 0) {
                    console.log('over!');
                    return 'QUIT';
                }

                if (takeDropCommands.length % 50 === 0) {
                    console.log(takeDropCommands.length);
                }

                input = takeDropCommands
                    .shift()
                    .split('')
                    .map(c => c.charCodeAt(0));
            }
        }

        if (input.length === 0 && hasEntered) {
            const prompt = new PromptInput({
                name: 'x',
                message: '>',
            });

            // promise
            return prompt.run().then(function(userInput) {
                input = (userInput + '\n').split('').map(c => c.charCodeAt(0));
                // console.log('new input', input);
                // console.log(userInput);
                const c = input.shift();
                doOutput && process.stdout.write(String.fromCharCode(c));
                return c;
            });
        }
        lastOutput = '';
        const c = input.shift();
        doOutput && process.stdout.write(String.fromCharCode(c));
        return c;
    },
    c => {
        const char = String.fromCharCode(c);
        lastOutput += char;
        doOutput && process.stdout.write(char);
    }
);
