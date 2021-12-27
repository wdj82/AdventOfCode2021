// Advent of Code day 23
// https://adventofcode.com/2021/day/23

import PriorityQueue from './priorityQueue.js';

// return in bound adjacent coordinates
function getAdjacentCells(currX, currY, gridHeight, gridWidth) {
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

const roomCols = { A: 2, B: 4, C: 6, D: 8 };
const typeCosts = { A: 1, B: 10, C: 100, D: 1000 };

// code the x,y where a fish can stop in the hallway
const hallwayStoppingPoints = [
    [0, 0],
    [0, 1],
    [0, 3],
    [0, 5],
    [0, 7],
    [0, 9],
    [0, 10],
];

function getPaths([startingX, startingY], burrow) {
    // console.log(startingX, startingY);

    const nodes = new PriorityQueue();
    const gridHeight = burrow.length;
    const gridWidth = burrow[0].length;
    const distances = [...Array(gridHeight)].map(() => Array(gridWidth).fill(null));

    for (let x = 0; x < gridHeight; x++) {
        for (let y = 0; y < gridWidth; y++) {
            if (x === startingX && y === startingY) {
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

        if (distances[x][y] !== Infinity) {
            getAdjacentCells(x, y, gridHeight, gridWidth).forEach(({ newX, newY }) => {
                // console.log(`burrow[${newX},${newY}] = ${burrow[newX][newY]}`);
                if (burrow[newX][newY] !== 0) {
                    const possibleNewMinDistance = distances[x][y] + burrow[newX][newY];

                    // check if the new path to each neighbor is shorter than previous recorded path
                    if (possibleNewMinDistance < distances[newX][newY]) {
                        // save new smallest distance to this neighbor
                        distances[newX][newY] = possibleNewMinDistance;
                        // enqueue with new priority
                        nodes.enqueue({ x: newX, y: newY }, possibleNewMinDistance);
                    }
                }
            });
        }
    }
    return distances;
}

function canMoveIntoRoom(type, currentX, currentY, burrow, distances) {
    const y = roomCols[type];
    console.log({ y });
    for (let x = burrow.length - 2; x >= 1; x--) {
        console.log(`currentBurrow[${x}, ${y}] = ${burrow[x][y]}`);
        if (currentX === x && currentY === y) {
            console.log('in correct spot');
            return { newX: x, newY: y };
        }

        if (distances[x][y] !== Infinity && distances[x][y] !== 0) {
            console.log('in final spot or can move into room');
            return { newX: x, newY: y };
        }
        // if(distances[x][y] === 0 ) {

        // }
        if (burrow[x][y] !== type) {
            console.log('wrong type in room or cannot reach');
            return { newX: null, newY: null };
        }
        // if (burrow[x][y] === 1) {
        //     console.log('can move into room');
        //     return { newX: x, newY: y };
        // }
    }
    // throw new Error('error checking if can move into room');
    return { newX: null, newY: null };
}

function getAmphipods(burrow) {
    const result = [];
    for (let x = 0; x < burrow.length; x++) {
        for (let y = 0; y < burrow[0].length; y++) {
            const cell = burrow[x][y];
            if (cell !== 0 && cell !== 1) {
                result.push({ type: cell, x, y });
            }
        }
    }

    result.sort((a, b) => {
        if (a.type < b.type) {
            return -1;
        }
        if (b.type < a.type) {
            return 1;
        }
        return 0;
    });
    return result;
}

function copyBurrow(oldBurrow) {
    const newBurrow = new Array(oldBurrow.length);
    for (let i = 0; i < newBurrow.length; i++) {
        newBurrow[i] = new Array(oldBurrow[0].length);
        for (let j = 0; j < newBurrow[i].length; j++) {
            newBurrow[i][j] = oldBurrow[i][j];
        }
    }
    return newBurrow;
}

const savedBurrowState = [];

function compareBurrowState(currentBurrow, totalCost) {
    console.log('checking if saved');
    console.log('current:', currentBurrow);
    for (let i = 0; i < savedBurrowState.length; i++) {
        const { savedBurrow, savedTotalCost } = savedBurrowState[0];
        console.log(savedBurrow);
        let same = true;
        for (let x = 0; x < savedBurrow.length; x++) {
            for (let y = 0; y < savedBurrow[0].length; y++) {
                if (savedBurrow[x][y] !== currentBurrow[x][y]) {
                    same = false;
                    break;
                }
            }
            if (same) {
                console.log('know about this burrow state');
                return savedTotalCost;
            }
        }
    }
    console.log('do not know about this burrow - saving it');
    savedBurrowState.push({ savedBurrow: currentBurrow, savedTotalCost: totalCost });
    return -1;
}

let lowestCost = Number.MAX_VALUE;
let step = 0;
function findLowestCost(currentBurrow, totalCost = 0) {
    const savedBurrowCost = compareBurrowState(currentBurrow, totalCost);
    if (savedBurrowCost !== -1) {
        return savedBurrowCost;
    }

    if (step === 50) {
        console.log('max steps');
        return totalCost;
    }
    console.log({ step });
    step += 1;

    console.log(copyBurrow(currentBurrow));

    const amphipods = getAmphipods(currentBurrow);
    const newBurrow = copyBurrow(currentBurrow);

    let correctSpots = 0;
    for (let i = 0; i < amphipods.length; i++) {
        const { type, x, y } = amphipods[i];
        console.log(type, x, y);

        const distances = getPaths([x, y], currentBurrow);
        console.log(distances);

        // try and move into it's room
        const { newX, newY } = canMoveIntoRoom(type, x, y, currentBurrow, distances);
        console.log(`[${x}, ${y}] -> [${newX}, ${newY}]`);
        if (newX !== null && distances[newX][newY] !== 0) {
            const cost = distances[newX][newY] * typeCosts[type];
            totalCost += cost;
            if (totalCost < lowestCost) {
                console.log('moving into room');
                console.log(`${type} at ${x}, ${y} is moving to ${newX}, ${newY}`);
                console.log({ totalCost });
                newBurrow[x][y] = 1;
                newBurrow[newX][newY] = type;
                const returnedCost = findLowestCost(newBurrow, totalCost);
                console.log({ returnedCost });
                console.log('back from recursion undoing');
                newBurrow[x][y] = type;
                newBurrow[newX][newY] = 1;
                totalCost -= cost;
                console.log(copyBurrow(newBurrow));
            } else {
                console.log('totalCost too high not moving');
            }
        } else if (x !== 0 && newX === null && distances[x - 1][y] !== Infinity) {
            console.log('trying to move into hallway');
            hallwayStoppingPoints.forEach(([targetX, targetY]) => {
                console.log({ x, y });
                console.log({ targetX, targetY });
                if (x !== targetX || y !== targetY) {
                    if (distances[targetX][targetY] !== Infinity) {
                        const cost = distances[targetX][targetY] * typeCosts[type];
                        totalCost += cost;
                        if (totalCost < lowestCost) {
                            console.log(
                                `moving ${type} at [${x}, ${y}] to the hallway [${targetX}, ${targetY}] for ${cost}`,
                            );
                            newBurrow[x][y] = 1;
                            newBurrow[targetX][targetY] = type;
                            console.log({ cost, totalCost });
                            const returnedCost = findLowestCost(newBurrow, totalCost);
                            console.log({ returnedCost });
                            console.log('back from recursive - undoing');
                            console.log(`moving ${type} from hallway at [${targetX}, ${targetY}] back to [${x}, ${y}]`);
                            newBurrow[x][y] = type;
                            newBurrow[targetX][targetY] = 1;
                            totalCost -= cost;
                            console.log(copyBurrow(newBurrow));
                        } else {
                            console.log('cost too high not moving');
                        }
                    } else {
                        console.log(`cannot move into hallway [${targetX}, ${targetY}]`);
                    }
                } else {
                    console.log('current position');
                }
            });
        } else if (x === 0) {
            console.log('in hallway stuck');
        } else if (newX !== null && distances[newX][newY] === 0) {
            console.log('not moving in correct spot');
            correctSpots += 1;
        } else if (newX !== null && distances[newX][newY] === Infinity) {
            console.log('hallway blocked');
        } else {
            console.log('cannot move out of room');
        }
    }
    if (correctSpots === amphipods.length) {
        lowestCost = Math.min(lowestCost, totalCost);
        console.log('----------------------------------------');
        console.log('ALL IN CORRECT SPOTS');
        console.log(`this total cost ${totalCost}`);
        console.log('lowestCost:', lowestCost);
        console.log('----------------------------------------');
    }
    return totalCost;
}

// const burrow = [
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//     [0, 0, 'B', 0, 'C', 0, 'B', 0, 'D', 0, 0],
//     [0, 0, 'A', 0, 'D', 0, 'C', 0, 'A', 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];

const burrow = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 'B', 0, 'C', 0, 'B', 0, 'D', 0, 0],
    [0, 0, 'D', 0, 'C', 0, 'B', 0, 'A', 0, 0],
    [0, 0, 'D', 0, 'B', 0, 'A', 0, 'C', 0, 0],
    [0, 0, 'A', 0, 'D', 0, 'C', 0, 'A', 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// const burrow = [
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//     [0, 0, 'A', 0, 'D', 0, 'C', 0, 'A', 0, 0],
//     [0, 0, 'C', 0, 'D', 0, 'B', 0, 'B', 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];

// const burrow = [
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//     [0, 0, 'A', 0, 'D', 0, 'C', 0, 'A', 0, 0],
//     [0, 0, 'D', 0, 'C', 0, 'B', 0, 'A', 0, 0],
//     [0, 0, 'D', 0, 'B', 0, 'A', 0, 'C', 0, 0],
//     [0, 0, 'C', 0, 'D', 0, 'B', 0, 'B', 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];
console.log(burrow);

findLowestCost(burrow);
console.log(lowestCost);

// console.log(`Part one: `, 'dunno');
// console.log(`Part two: `, 'dunno');
document.getElementById('partOne').appendChild(document.createTextNode('dunno'));
document.getElementById('partTwo').appendChild(document.createTextNode('dunno'));
