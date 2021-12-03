import rawInput from './rawInput.js';
// const rawInput = `00100
// 11110
// 10110
// 10111
// 10101
// 01111
// 00111
// 11100
// 10000
// 11001
// 00010
// 01010`;

function powerConsumption(input) {
    // create array of objects to count the bits
    const count = new Array(input[0].length);
    for (let i = 0; i < count.length; i++) {
        count[i] = { zeroes: 0, ones: 0 };
    }

    // find how many zeroes and ones there are for each bit of each index
    for (let i = 0; i < input.length; i++) {
        input[i].split('').forEach((digit, index) => {
            if (digit === '0') {
                count[index].zeroes += 1;
            } else {
                count[index].ones += 1;
            }
        });
    }

    let gamma = '';
    let epsilon = '';
    count.forEach(({ zeroes, ones }) => {
        if (zeroes > ones) {
            gamma += '0';
            epsilon += '1';
        } else {
            gamma += '1';
            epsilon += '0';
        }
    });
    return parseInt(gamma, 2) * parseInt(epsilon, 2);
}

// sort the numbers by the ones and zeroes at the current position
function calculateOnesAndZeroes(array, currentBit = 0) {
    const zeroes = [];
    const ones = [];

    for (let i = 0; i < array.length; i++) {
        const digit = array[i];
        if (digit[currentBit] === '0') {
            zeroes.push(digit);
        } else {
            ones.push(digit);
        }
    }
    // return the oxygen and co2 arrays based on the most ones and zeroes
    if (ones.length >= zeroes.length) {
        return { oxygen: ones, co2: zeroes };
    }
    return { oxygen: zeroes, co2: ones };
}

// find the final binary number for the oxygen or co2
function getOxygenOrCo2(array, target = 'oxygen') {
    let result = [...array];
    let currentBit = 1;

    while (result.length !== 1) {
        const object = calculateOnesAndZeroes(result, currentBit);
        if (target === 'oxygen') {
            result = [...object.oxygen];
        } else {
            result = [...object.co2];
        }
        currentBit += 1;
    }
    return result;
}

function lifeSupport(input) {
    const { oxygen, co2 } = calculateOnesAndZeroes(input);

    const oxygenBinary = getOxygenOrCo2(oxygen);
    const co2Binary = getOxygenOrCo2(co2, 'co2');

    return parseInt(oxygenBinary, 2) * parseInt(co2Binary, 2);
}

const input = rawInput.split('\n');
console.log('Part one answer is:', powerConsumption(input));
console.log('Part two answer is:', lifeSupport(input));
