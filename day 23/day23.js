// Advent of Code day 23
// https://adventofcode.com/2021/day/23

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

const input = rawInput;

console.log(input);

// return in bound adjacent coordinates
function getAdjacentCells(currX, currY) {
    // use for traversing the four directions of the grid
    const searchDirections = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
    ];
    const result = [];

    for (let i = 0; i < searchDirections.length; i++) {
        const x = searchDirections[i].x + currX;
        const y = searchDirections[i].y + currY;
        if (x >= 0 && x < gridHeight && y >= 0 && y < gridWidth) {
            result.push({ newX: x, newY: y });
        }
    }
    return result;
}

// console.log(`Part one: `, 'dunno');
// console.log(`Part two: `, 'dunno');
document.getElementById('partOne').appendChild(document.createTextNode('dunno'));
document.getElementById('partTwo').appendChild(document.createTextNode('dunno'));
