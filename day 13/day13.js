// Advent of Code day 13
// https://adventofcode.com/2021/day/13

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

function getInput() {
    const [rawDots, rawInstructions] = rawInput.split('\n\n');

    const startingDots = rawDots.split('\n').map((line) => line.split(',').map(Number));

    const instructions = rawInstructions.split('\n').map((line) => {
        const index = line.indexOf('=');
        return [line[index - 1], Number(line.slice(index + 1))];
    });

    return { startingDots, instructions };
}

function getWidthAndHeight(dots) {
    let height = 0;
    let width = 0;
    dots.forEach(([x, y]) => {
        height = Math.max(height, y);
        width = Math.max(width, x);
    });
    return { height, width };
}

// fold the given dots
function foldPaper(dots, [axis, value], isPartOne = false) {
    const newDots = [];
    const hash = {};

    const { height, width } = getWidthAndHeight(dots);

    dots.forEach(([x, y]) => {
        // flip the dots if they're over the given fold axis' value
        if (axis === 'y' && y > value) {
            y = height - y;
        } else if (axis === 'x' && x > value) {
            x = width - x;
        }

        // avoid duplicates - technically only needed for part one
        if (!hash[`${x},${y}`]) {
            hash[`${x},${y}`] = true;
            newDots.push([x, y]);
        }
    });

    // part one just needs the dot count
    if (isPartOne) {
        return newDots.length;
    }

    // return the folded paper
    return newDots;
}

// fold the dots following the instructions
function getCode(dots, instructions) {
    let newDots = [...dots];
    instructions.forEach((instruction) => {
        newDots = foldPaper(newDots, instruction);
    });
    return newDots;
}

// draw the code in the html canvas
function printCode(dots) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    const size = 6;

    dots.forEach(([x, y]) => {
        ctx.fillRect(x * size, y * size, size, size);
    });
}

const { startingDots, instructions } = getInput();
const firstFoldCount = foldPaper(startingDots, instructions[0], true);
const code = getCode(startingDots, instructions);

document.getElementById('partOne').appendChild(document.createTextNode(firstFoldCount));
printCode(code);
