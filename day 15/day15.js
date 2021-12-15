// Advent of Code day 15
// https://adventofcode.com/2021/day/15

import PriorityQueue from './priorityQueue.js';
// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

// use for traversing the grid
const searchDirections = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
];

// return in bound adjacent coordinates
function getAdjacentCells(currX, currY, gridSize) {
    const result = [];

    for (let i = 0; i < searchDirections.length; i++) {
        const newX = searchDirections[i].x + currX;
        const newY = searchDirections[i].y + currY;
        if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
            result.push({ newX, newY });
        }
    }
    return result;
}

function extendGrid(grid) {
    const gridSize = grid.length;

    const expandedGrid = [...Array(gridSize * 5)].map(() => Array(gridSize * 5));
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            expandedGrid[x][y] = grid[x][y];
        }
    }

    for (let x = gridSize; x < gridSize * 5; x++) {
        for (let y = 0; y < gridSize; y++) {
            const newValue = expandedGrid[x - gridSize][y] + 1;
            expandedGrid[x][y] = newValue > 9 ? 1 : newValue;
        }
    }

    for (let x = 0; x < gridSize * 5; x++) {
        for (let y = gridSize; y < gridSize * 5; y++) {
            const newValue = expandedGrid[x][y - gridSize] + 1;
            expandedGrid[x][y] = newValue > 9 ? 1 : newValue;
        }
    }

    return expandedGrid;
}

// Dijkstra's
function shortestPath(grid) {
    const gridSize = grid.length;
    const distances = [...Array(gridSize)].map(() => Array(gridSize).fill(null));
    const nodes = new PriorityQueue();

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            if (x === 0 && y === 0) {
                // save the starting node as 0 distance
                distances[x][y] = 0;
                nodes.enqueue({ x, y }, 0);
            } else {
                // all other nodes are infinity distance away
                distances[x][y] = Infinity;
                nodes.enqueue({ x, y }, Infinity);
            }
        }
    }

    while (!nodes.isEmpty()) {
        const { x, y } = nodes.dequeue().value;

        if (x === gridSize - 1 && y === gridSize - 1) {
            // found the end - return the saved shortest distance
            return distances[gridSize - 1][gridSize - 1];
        }

        if (distances[x][y] !== Infinity) {
            getAdjacentCells(x, y, gridSize).forEach(({ newX, newY }) => {
                const possibleNewMinDistance = distances[x][y] + grid[newX][newY];

                // check if the new path to each neighbor is shorter than previous recorded path
                if (possibleNewMinDistance < distances[newX][newY]) {
                    // save new smallest distance to this neighbor
                    distances[newX][newY] = possibleNewMinDistance;
                    // enqueue with new priority
                    nodes.enqueue({ x: newX, y: newY }, possibleNewMinDistance);
                }
            });
        }
    }
    throw new Error('something went wrong');
}

const grid = rawInput.split('\n').map((line) => line.split('').map(Number));
const expandedGrid = extendGrid(grid);

const partOne = shortestPath(grid);
const partTwo = shortestPath(expandedGrid);

console.log(`Part one: `, partOne);
console.log(`Part two: `, partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
