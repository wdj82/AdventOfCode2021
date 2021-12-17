// Advent of Code day 17
// https://adventofcode.com/2021/day/17

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

const [[xStart, xEnd], [yStart, yEnd]] = rawInput
    .slice(rawInput.indexOf('x'))
    .split(', ')
    .map((range) => range.slice(2).split('..').map(Number));

function yeetProbe(xVel, yVel) {
    let x = 0;
    let y = 0;
    let newMaxY = 0;

    while (x <= xEnd && y >= yStart) {
        x += xVel;
        y += yVel;
        newMaxY = Math.max(newMaxY, y);
        if (xVel > 0) {
            xVel -= 1;
        }
        if (xVel < 0) {
            xVel += 1;
        }
        yVel -= 1;
        if (x >= xStart && x <= xEnd && y >= yStart && y <= yEnd) {
            return { result: 'hit', newMaxY };
        }
    }

    return { result: 'passed', newMaxY };
}

function findHits() {
    let maxY = 0;
    let count = 0;
    // brute force it
    for (let xVel = 0; xVel < 1000; xVel++) {
        for (let yVel = -1000; yVel < 1000; yVel++) {
            const { result, newMaxY } = yeetProbe(xVel, yVel);
            if (result === 'hit') {
                count += 1;
                maxY = Math.max(newMaxY, maxY);
            }
        }
    }
    return [maxY, count];
}

const [partOne, partTwo] = findHits();

console.log(`Part one: `, partOne);
console.log(`Part two: `, partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
