// Advent of Code day 13
// https://adventofcode.com/2021/day/13

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

const [rawDots, rawInstructions] = rawInput.split('\n\n');

function getWidthAndHeight(dots) {
    let height = 0;
    let width = 0;
    dots.forEach(([x, y]) => {
        height = Math.max(height, y);
        width = Math.max(width, x);
    });
    return { height, width };
}

function foldPaper(dots, [axis, value], isPartOne = false) {
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
            if (isPartOne) {
                count += 1;
            }
        }
    });

    if (isPartOne) {
        return count;
    }

    return newDots;
}

function getCode(dots, instructions) {
    let newDots = [...dots];
    instructions.forEach((instruction) => {
        newDots = foldPaper(newDots, instruction);
    });
    return newDots;
}

function printCode(dots) {
    // draw the code in the html canvas
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    const size = 6;

    dots.forEach(([x, y]) => {
        ctx.fillRect(x * size, y * size, size, size);
    });
}

const startingDots = rawDots.split('\n').map((line) => line.split(',').map(Number));

const instructions = rawInstructions.split('\n').map((line) => {
    const index = line.indexOf('=');
    return [line[index - 1], Number(line.slice(index + 1))];
});

const firstFoldCount = foldPaper(startingDots, instructions[0], true);
const code = getCode(startingDots, instructions);

document.getElementById('partOne').appendChild(document.createTextNode(firstFoldCount));
printCode(code);
