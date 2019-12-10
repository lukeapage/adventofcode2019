const getCharsInLayer = (layer, matchChar) =>
    layer.filter(char => char === matchChar).length;

const getMinIndex = arr => {
    let minindex = 0;
    let minnum = Infinity;
    arr.forEach((element, index) => {
        if (element < minnum) {
            minindex = index;
            minnum = element;
        }
    });
    return minindex;
};

module.exports = (data, width, height) => {
    const layers = [];
    const layerSize = width * height;
    for (let i = 0; i < data.length; i += layerSize) {
        layers.push(data.slice(i, i + layerSize).split(''));
    }
    const zeros = layers.map(layer => getCharsInLayer(layer, '0'));
    const pickedIndex = getMinIndex(zeros);
    const pickedLayer = layers[pickedIndex];

    let image = '\n';
    let i = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let pixel = '2';
            for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
                if (layers[layerIndex][i] === '2') {
                    continue;
                }
                pixel = layers[layerIndex][i];
                break;
            }

            image += pixel === '0' ? ' ' : '0';
            i++;
        }
        image += '\n';
    }

    return {
        checksum:
            getCharsInLayer(pickedLayer, '1') *
            getCharsInLayer(pickedLayer, '2'),
        image,
    };
};
