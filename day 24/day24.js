// Advent of Code day 24
// https://adventofcode.com/2021/day/24

// solution used from https://github.com/dphilipson/advent-of-code-2021/blob/master/src/days/day24.rs

import { puzzleInput as rawInput } from './rawInput.js';

const instructions = rawInput.split('\n').map((line) => line.split(' '));

const parameters = [];
for (let index = 0; index < 18 * 14; index += 18) {
    const p1 = Number(instructions[index + 5][2]);
    const p2 = Number(instructions[index + 15][2]);
    parameters.push([p1, p2]);
}
console.log(parameters);
// parameters:
//  [14, 8]
//  [13, 8]
//  [13, 3]
//  [12, 10]
//  [-12, 8]
//  [12, 8]
//  [-2, 8]
//  [-11, 5]
//  [13, 9]
//  [14, 3]
//  [0, 4]
//  [-12, 9]
//  [-13, 2]
//  [-6, 7]

// PUSH input[0] + 8
// PUSH input[1] + 8
// PUSH input[2] + 3
// PUSH input[3] + 10
// POP. Must have input[4] == popped_value - 12
// PUSH input[5] + 8
// POP. Must have input[6] == popped_value - 2
// POP. Must have input[7] == popped_value - 11
// PUSH input[8] + 9
// PUSH input[9] + 3
// POP. Must have input[10] == popped_value
// POP. Must have input[11] == popped_value - 12
// POP. Must have input[12] == popped_value - 13
// POP. Must have input[13] == popped_value - 6

function findMax() {
    const input = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9];
    input[4] = input[3] - 2;
    input[5] = input[6] - 6;
    input[7] = input[2] - 8;
    input[9] = input[10] - 3;
    input[11] = input[8] - 3;
    input[12] = input[1] - 5;
    input[0] = input[13] - 2;
    return input.join('');
}

function findMin() {
    const input = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    input[3] = input[4] + 2;
    input[6] = input[5] + 6;
    input[2] = input[7] + 8;
    input[10] = input[9] + 3;
    input[10] = input[9] + 3;
    input[8] = input[11] + 3;
    input[1] = input[12] + 5;
    input[13] = input[0] + 2;
    return input.join('');
}

const partOne = findMax();
const partTwo = findMin();

console.log(`Part one: `, partOne);
console.log(`Part two: `, partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
