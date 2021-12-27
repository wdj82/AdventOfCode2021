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

function getRoom(type, burrow) {
    const room = [];
    const y = roomCols[type];
    for (let x = 1; x < burrow.length; x++) {
        room.push(burrow[x][y]);
    }
    return room;
}

function getAmphipods(burrow) {
    const hallwayShrimp = [];
    const roomShrimp = [];
    for (let x = 0; x < burrow.length; x++) {
        for (let y = 0; y < burrow[0].length; y++) {
            const cell = burrow[x][y];
            if (cell !== 0 && cell !== 1) {
                if (x === 0) {
                    hallwayShrimp.push({ type: cell, x, y });
                } else {
                    roomShrimp.push({ type: cell, x, y });
                }
            }
        }
    }

    return { hallwayShrimp, roomShrimp };
}

function movesToRoom(hallwayShrimp, burrow) {
    hallwayShrimp.forEach(({ type, x, y }) => {
        console.log(`Type ${type} at [${x}, ${y}]`);
        const room = getRoom(type, burrow);
        console.log({ room });
        if (room.every((cell) => cell === 1 || cell === type)) {
            console.log('');
        }
        const distance = getPaths([x, y], burrow);
    });
}

function findLowestCost(burrow) {
    const { hallwayShrimp, roomShrimp } = getAmphipods(burrow);
    console.log({ hallwayShrimp, roomShrimp });
    movesToRoom(hallwayShrimp, burrow);
}

const burrow = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 'B', 0, 'C', 0, 'B', 0, 'D', 0, 0],
    [0, 0, 'A', 0, 'D', 0, 'C', 0, 'A', 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// const burrow = [
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//     [0, 0, 'B', 0, 'C', 0, 'B', 0, 'D', 0, 0],
//     [0, 0, 'D', 0, 'C', 0, 'B', 0, 'A', 0, 0],
//     [0, 0, 'D', 0, 'B', 0, 'A', 0, 'C', 0, 0],
//     [0, 0, 'A', 0, 'D', 0, 'C', 0, 'A', 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];

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

findLowestCost(burrow);

// console.log(`Part one: `, 'dunno');
// console.log(`Part two: `, 'dunno');
document.getElementById('partOne').appendChild(document.createTextNode('dunno'));
document.getElementById('partTwo').appendChild(document.createTextNode('dunno'));
