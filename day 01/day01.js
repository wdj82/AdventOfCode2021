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

function depthIncreases() {
    const input = rawInput.split('\n').map(Number);
    return input.reduce((increases, curr, index) => {
        if (curr > input[index - 1]) {
            increases += 1;
        }
        return increases;
    }, 0);
}

console.log(depthIncreases());
