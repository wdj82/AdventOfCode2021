// Advent of Code day 13
// https://adventofcode.com/2021/day/13

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

const [rawDots, rawInstructions] = rawInput.split('\n\n');

let partOne = 0;

function getWidthAndHeight(dots) {
    let height = 0;
    let width = 0;
    dots.forEach(([x, y]) => {
        height = Math.max(height, y);
        width = Math.max(width, x);
    });
    return { height, width };
}

function getDots(dots, [axis, value], isPartOne = false) {
    const paper = {};
    const newDots = [];
    let count = 0;

    const { height, width } = getWidthAndHeight(dots);

    dots.forEach(([x, y]) => {
        if (axis === 'y' && y > value) {
            y = height - y;
        } else if (axis === 'x' && x > value) {
            x = width - x;
        }

        if (!paper[`${x},${y}`]) {
            paper[`${x},${y}`] = 1;
            newDots.push([x, y]);
            count += 1;
        }
    });
    if (isPartOne) {
        partOne = count;
    }

    return newDots;
}

function getCode(instructions, dots) {
    let newDots = [...dots];
    instructions.forEach((instruction, index) => {
        // use index for part one check
        newDots = getDots(newDots, instruction, index === 0);
    });
    return newDots;
}

function printCode(dots) {
    const { height, width } = getWidthAndHeight(dots);

    // print the dots for part two code solution
    const paper = new Array(height + 1);
    for (let row = 0; row <= height; row++) {
        paper[row] = new Array(width + 1);
        for (let col = 0; col <= width; col++) {
            paper[row][col] = '.';
        }
    }
    dots.forEach(([x, y]) => {
        paper[y][x] = '#';
    });
    console.log('Part two:', paper);
}

const startingDots = rawDots.split('\n').map((line) => line.split(',').map(Number));

const instructions = rawInstructions.split('\n').map((line) => {
    const index = line.indexOf('=');
    return [line[index - 1], Number(line.slice(index + 1))];
});

const finalDots = getCode(instructions, startingDots);
console.log(`Part one: `, partOne);
printCode(finalDots);

document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode('in console'));
