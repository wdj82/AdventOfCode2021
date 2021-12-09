// Advent of Code day 9
// https://adventofcode.com/2021/day/9

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

const grid = rawInput.split('\n').map((line) => line.split('').map(Number));
const gridHeight = grid.length;
const gridWidth = grid[0].length;

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

// find low points where nothing lower is adjacent on the grid
function getLowestPoints() {
    const lowestCoords = [];
    let lowestPointSum = 0;

    for (let row = 0; row < gridHeight; row++) {
        for (let column = 0; column < gridWidth; column++) {
            const cell = grid[row][column];

            // check each adjacent cell to see if it's lower than current cell
            const isLowest = getAdjacentCells(row, column).reduce((lowest, { newX, newY }) => {
                if (!lowest) {
                    return false;
                }
                return cell < grid[newX][newY];
            }, true);
            if (isLowest) {
                lowestPointSum += cell + 1;
                lowestCoords.push({ x: row, y: column });
            }
        }
    }
    return { lowestPointSum, lowestCoords };
}

// find the basins from each of the lowest points
// traverse the grid until we hit 9s and can't continue
function getThreeLargestBasins(lowestCoords) {
    // create the visited grid
    const visitedGrid = new Array(gridHeight);
    for (let i = 0; i < gridHeight; i++) {
        visitedGrid[i] = new Array(gridWidth);
        for (let j = 0; j < gridWidth; j++) {
            visitedGrid[i][j] = false;
        }
    }
    const basins = [];

    // basic breadth first search
    lowestCoords.forEach((cell) => {
        const result = [];
        const stack = [cell];
        visitedGrid[cell.x][cell.y] = true;

        while (stack.length) {
            const { x, y } = stack.pop();
            const currentCellValue = grid[x][y];
            result.push(currentCellValue);

            getAdjacentCells(x, y).forEach(({ newX, newY }) => {
                if (!visitedGrid[newX][newY] && grid[newX][newY] < 9) {
                    visitedGrid[newX][newY] = true;
                    stack.push({ x: newX, y: newY });
                }
            });
        }

        // save the size of the basin
        basins.push(result.length);
    });

    // sort the found basins by size and get the three largest
    const [first, second, third] = basins.sort((a, b) => b - a);
    return first * second * third;
}

const { lowestPointSum, lowestCoords } = getLowestPoints();
const largestBasins = getThreeLargestBasins(lowestCoords);

// console.log(`Part one: `, lowestPointSum);
// console.log(`Part two: `, largestBasins);
document.getElementById('partOne').appendChild(document.createTextNode(lowestPointSum));
document.getElementById('partTwo').appendChild(document.createTextNode(largestBasins));
