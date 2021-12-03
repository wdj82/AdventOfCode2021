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
    let gamma = '';
    let epsilon = '';

    const count = new Array(input[0].length);
    for (let i = 0; i < count.length; i++) {
        count[i] = { zeroes: 0, ones: 0 };
    }

    for (let i = 0; i < input.length; i++) {
        input[i].split('').forEach((digit, index) => {
            if (digit === '0') {
                count[index].zeroes += 1;
            } else {
                count[index].ones += 1;
            }
        });
    }

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

const input = rawInput.split('\n');
console.log('The part one answer is: ', powerConsumption(input));
