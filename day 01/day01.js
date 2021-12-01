import rawInput from './rawInput.js';
// const rawInput = `199
// 200
// 208
// 210
// 200
// 207
// 240
// 269
// 260
// 263`;

function depthIncreases(input) {
    return input.reduce((increases, curr, index) => {
        if (curr > input[index - 1]) {
            increases += 1;
        }
        return increases;
    }, 0);
}

function depthIncreasesOfThree(input) {
    let increases = 0;
    let currMeasurement = 0;
    let prevMeasurement = input[0] + input[1] + input[2];

    for (let i = 1; i < input.length - 1; i++) {
        currMeasurement = input[i] + input[i + 1] + input[i + 2];
        if (currMeasurement > prevMeasurement) {
            increases += 1;
        }
        prevMeasurement = currMeasurement;
    }

    return increases;
}

const input = rawInput.split('\n').map(Number);
console.log('Part one answer:', depthIncreases(input));
console.log('Part two answer:', depthIncreasesOfThree(input));
