// Advent of Code day 5
// https://adventofcode.com/2021/day/5

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

let gridSize = 0;

const allInputs = rawInput.split('\n').map((line) =>
    line.split(' -> ').map((cords) =>
        cords.split(',').map((digit) => {
            const number = Number(digit);
            gridSize = Math.max(gridSize, number);
            return number;
        }),
    ),
);

// no diagonals in part one
const partOneInput = allInputs.filter(([a, b]) => a[0] === b[0] || a[1] === b[1]);

function getSlope(start, end) {
    if (start < end) return 1;
    if (start > end) return -1;
    return 0;
}

function findOverlaps(input) {
    let count = 0;

    // create the grid
    const grid = new Array(gridSize + 1);
    for (let i = 0; i <= gridSize; i++) {
        grid[i] = new Array(gridSize + 1);
        for (let j = 0; j <= gridSize; j++) {
            grid[i][j] = { isCounted: false, overlaps: 0 };
        }
    }

    // keep track of the overlaps
    const markCell = (x, y) => {
        grid[x][y].overlaps += 1;
        if (!grid[x][y].isCounted && grid[x][y].overlaps >= 2) {
            grid[x][y].isCounted = true;
            count += 1;
        }
    };

    // create the lines
    input.forEach(([[x1, y1], [x2, y2]]) => {
        // console.log(`${x1},${y1} -> ${x2},${y2}`);
        const xSlope = getSlope(x1, x2);
        const ySlope = getSlope(y1, y2);
        let x = x1;
        let y = y1;

        markCell(x, y);
        while (x !== x2 || y !== y2) {
            x += xSlope;
            y += ySlope;
            markCell(x, y);
        }
    });

    return count;
}

// console.log('The answer to part one is:', findOverlaps(partOneInput));
// console.log('The answer to part two is:', findOverlaps(allInputs));
document.getElementById('partOne').appendChild(document.createTextNode(findOverlaps(partOneInput)));
document.getElementById('partTwo').appendChild(document.createTextNode(findOverlaps(allInputs)));
