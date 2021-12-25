// Advent of Code day 25
// https://adventofcode.com/2021/day/25

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

function getGridCopy(oldGrid) {
    const newGrid = new Array(oldGrid.length);
    for (let i = 0; i < newGrid.length; i++) {
        newGrid[i] = new Array(oldGrid[0].length);
        for (let j = 0; j < oldGrid[0].length; j++) {
            newGrid[i][j] = oldGrid[i][j];
        }
    }
    return newGrid;
}

function findWhenStopMoving() {
    let grid = rawInput.split('\n').map((line) => line.split(''));
    let step = 0;
    let fishMoved = true;

    while (fishMoved) {
        fishMoved = false;
        const downFishGrid = getGridCopy(grid);
        step += 1;
        const downFish = [];
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[0].length; y++) {
                const fish = grid[x][y];
                if (fish !== '.') {
                    if (fish === '>') {
                        const newY = y + 1 === grid[0].length ? 0 : y + 1;
                        if (grid[x][newY] === '.') {
                            downFishGrid[x][y] = '.';
                            downFishGrid[x][newY] = '>';
                            y += 1;
                            fishMoved = true;
                        }
                    } else {
                        // save found down fish so don't have to loop through grid again
                        downFish.push([x, y]);
                    }
                }
            }
        }

        const finalGrid = getGridCopy(downFishGrid);

        downFish.forEach(([x, y]) => {
            const newX = x + 1 === downFishGrid.length ? 0 : x + 1;
            if (downFishGrid[newX][y] === '.') {
                finalGrid[x][y] = '.';
                finalGrid[newX][y] = 'v';
                fishMoved = true;
            }
        });

        grid = finalGrid;
    }
    return step;
}
const partOne = findWhenStopMoving();

console.log(`Part one: `, partOne);

document.getElementById('partOne').appendChild(document.createTextNode(partOne));
