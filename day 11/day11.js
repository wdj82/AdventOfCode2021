// Advent of Code day 11
// https://adventofcode.com/2021/day/11

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

// return in bound adjacent coordinates
function getAdjacentCells(currX, currY, gridSize) {
    // use for traversing the eight directions of the grid
    const searchDirections = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: -1 },
    ];
    const result = [];

    for (let i = 0; i < searchDirections.length; i++) {
        const x = searchDirections[i].x + currX;
        const y = searchDirections[i].y + currY;
        if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
            result.push({ newX: x, newY: y });
        }
    }
    return result;
}

function copyGrid(grid) {
    const gridSize = grid.length;
    const newGrid = new Array(gridSize);
    for (let i = 0; i < gridSize; i++) {
        newGrid[i] = new Array(gridSize);
        for (let j = 0; j < gridSize; j++) {
            newGrid[i][j] = grid[i][j];
        }
    }
    return newGrid;
}

// mutates given grid to increment every cell by 1
function incrementGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            grid[i][j] += 1;
        }
    }
}

// using breadth first search to find all cascading flashes
function flash(row, col, grid) {
    let flashes = 1;
    const cell = { x: row, y: col };
    const stack = [cell];
    grid[row][col] = 0;

    while (stack.length) {
        const { x, y } = stack.pop();

        getAdjacentCells(x, y, grid.length).forEach(({ newX, newY }) => {
            if (grid[newX][newY] > 0) {
                // increase the levels of all neighbors that haven't yet flashed
                grid[newX][newY] += 1;
                // if that pushes them over 10 flash them and check their neighbors
                if (grid[newX][newY] > 9) {
                    grid[newX][newY] = 0;
                    flashes += 1;
                    stack.push({ x: newX, y: newY });
                }
            }
        });
    }

    return flashes;
}

// will mutate grid
// increments the entire grid
// any value over 9 will flash and cascade throughout the grid
// returns total flashes that occurred
function energyStep(grid) {
    incrementGrid(grid);
    let flashes = 0;

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid.length; col++) {
            const currCell = grid[row][col];
            if (currCell > 9) {
                // flash this octopus and cascade through neighbors
                flashes += flash(row, col, grid);
            }
        }
    }
    return flashes;
}

// count the total flashes for the given steps
function countFlashes(grid, endStep = 100) {
    let totalFlashed = 0;
    const newGrid = copyGrid(grid);
    let step = 0;
    while (step < endStep) {
        totalFlashed += energyStep(newGrid);
        step += 1;
    }
    return totalFlashed;
}

// iterate until all the fish flash at once
function findWhenAllFlash(grid) {
    const newGrid = copyGrid(grid);
    let step = 0;
    let flashes = 0;
    while (flashes < 100) {
        flashes = energyStep(newGrid);
        step += 1;
    }
    return step;
}

const energyGrid = rawInput.split('\n').map((line) => line.split('').map(Number));
const partOne = countFlashes(energyGrid);
const partTwo = findWhenAllFlash(energyGrid);

console.log(`Part one: `, partOne);
console.log(`Part two: `, partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
