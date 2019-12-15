module.exports = (transformText, oreProvided) => {
    transformText = transformText.trim();
    const transformMap = transformText.split('\n').reduce((map, line) => {
        const [inputText, outputText] = line.split('=>');
        const [outputSize, outputType] = outputText.trim().split(' ');
        const inputs = inputText
            .trim()
            .split(',')
            .map(inputText => {
                const [inputSize, inputType] = inputText.trim().split(' ');
                return {
                    type: inputType,
                    size: inputSize,
                };
            });
        map[outputType] = {
            size: outputSize.trim(),
            inputs,
        };
        return map;
    }, {});
    let storeHouse;
    const makeIngredient = (wantedType, amount, isFirst = true) => {
        if (isFirst) {
            storeHouse = {};
        }

        const { inputs, size } = transformMap[wantedType];

        if (storeHouse[wantedType] >= amount) {
            storeHouse[wantedType] -= amount;
            return 0;
        } else if (storeHouse[wantedType] > 0) {
            amount -= storeHouse[wantedType];
            storeHouse[wantedType] = 0;
        }

        const multiplier = Math.ceil(amount / size);
        const leftOver = multiplier * size - amount;
        storeHouse[wantedType] = leftOver;

        return inputs.reduce((oreNeeded, input) => {
            if (input.type === 'ORE') {
                return (oreNeeded += multiplier * input.size);
            } else {
                return (oreNeeded += makeIngredient(
                    input.type,
                    multiplier * input.size,
                    false
                ));
            }
        }, 0);
    };

    const binarySearch = (bottom, top) => {
        if (top === bottom) {
            return top;
        }
        const mid = Math.ceil((top + bottom) / 2);
        const oreNeeded = makeIngredient('FUEL', mid);
        if (oreNeeded > oreProvided) {
            // fail - pick 1 less
            return binarySearch(bottom, mid - 1);
        } else if (oreNeeded === oreProvided) {
            return mid;
        } else {
            return binarySearch(mid, top);
        }
    };

    if (oreProvided) {
        const toMakeOne = makeIngredient('FUEL', 1);
        let bottom = toMakeOne;
        let top = Math.ceil((oreProvided / toMakeOne) * 2);
        return binarySearch(bottom, top);
    } else {
        return makeIngredient('FUEL', 1);
    }
};
