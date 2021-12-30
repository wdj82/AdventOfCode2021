// Advent of Code day 23
// https://adventofcode.com/2021/day/23

import getPaths from './getPaths.js';

const roomCols = { A: 2, B: 4, C: 6, D: 8 };
const typeCosts = { A: 1, B: 10, C: 100, D: 1000 };
const types = ['A', 'B', 'C', 'D'];

// the x,y where a shrimp can stop in the hallway
const hallwayStoppingPoints = [
    [0, 0],
    [0, 1],
    [0, 3],
    [0, 5],
    [0, 7],
    [0, 9],
    [0, 10],
];

function canMoveIntoRoom(type, burrow) {
    const y = roomCols[type];
    for (let x = 1; x < burrow.length - 1; x++) {
        if (burrow[x][y] !== 1 && burrow[x][y] !== type) {
            return false;
        }
    }
    return true;
}

function isRoomDone(type, burrow) {
    const y = roomCols[type];
    for (let x = 1; x < burrow.length - 1; x++) {
        if (burrow[x][y] !== type) {
            return false;
        }
    }
    return true;
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

// return all possible moves from hallway to room and their cost for this burrow
function movesToRoom(burrow) {
    const nextBurrows = [];

    hallwayStoppingPoints.forEach(([x, y]) => {
        const shrimp = burrow[x][y];
        if (shrimp !== 1) {
            const distance = getPaths([x, y], burrow);

            if (canMoveIntoRoom(shrimp, burrow)) {
                const roomY = roomCols[shrimp];

                // look bottom up for empty space in the room to move into
                for (let roomX = burrow.length - 2; roomX >= 1; roomX--) {
                    if (distance[roomX][roomY] !== Infinity) {
                        const cost = distance[roomX][roomY] * typeCosts[shrimp];
                        const newBurrow = copyBurrow(burrow);
                        newBurrow[x][y] = 1;
                        newBurrow[roomX][roomY] = shrimp;
                        nextBurrows.push({ newBurrow, cost });
                        break;
                    }
                }
            }
        }
    });

    return nextBurrows;
}

// return all possible moves from rooms to the hallway and their cost for this burrow
function movesToHallway(burrow) {
    const newMoves = [];
    types.forEach((type) => {
        if (!isRoomDone(type, burrow) && !canMoveIntoRoom(type, burrow)) {
            const roomY = roomCols[type];
            for (let roomX = burrow.length - 2; roomX >= 1; roomX--) {
                const shrimp = burrow[roomX][roomY];

                // check for shrimp in room and empty space above it so it can get out of room
                if (shrimp !== 1 && burrow[roomX - 1][roomY] === 1) {
                    const distance = getPaths([roomX, roomY], burrow);

                    // save new burrow states for all possible hallway moves
                    hallwayStoppingPoints.forEach(([x, y]) => {
                        if (distance[x][y] !== Infinity) {
                            const cost = distance[x][y] * typeCosts[shrimp];
                            const newBurrow = copyBurrow(burrow);
                            newBurrow[x][y] = shrimp;
                            newBurrow[roomX][roomY] = 1;
                            newMoves.push({ newBurrow, cost });
                        }
                    });
                    break;
                }
            }
        }
    });

    return newMoves;
}

function getPossibleMoves(burrow) {
    const hallwayToRoomMoves = movesToRoom(burrow);
    // if we have moves to room it's always the best move - don't calculate moves to hallway for this burrow state
    if (hallwayToRoomMoves.length !== 0) {
        return hallwayToRoomMoves;
    }
    return movesToHallway(burrow);
}

// cache used to save discovered costs
const seenBurrowStates = {};

// recursively search all possible moves and find the lowest cost to all rooms sorted
function findLowestCost(burrow) {
    // all rooms sorted return 0 cost
    if (types.every((type) => isRoomDone(type, burrow))) {
        return 0;
    }

    // check if we've seen this burrow before - if so return it's saved cost
    const key = JSON.stringify(burrow);
    if (seenBurrowStates[key]) {
        return seenBurrowStates[key];
    }

    let leastCost = Infinity;

    // depth first search every possible move for this burrow until end state
    // if no possible moves will return infinity
    getPossibleMoves(burrow).forEach(({ newBurrow, cost }) => {
        cost += findLowestCost(newBurrow);

        if (cost < leastCost) {
            leastCost = cost;
        }
    });

    // cache the lowest cost found for this burrow for future searches
    seenBurrowStates[key] = leastCost;
    return leastCost;
}

// didn't feel like parsing the input
const partOneBurrow = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 'A', 0, 'D', 0, 'C', 0, 'A', 0, 0],
    [0, 0, 'C', 0, 'D', 0, 'B', 0, 'B', 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const partTwoBurrow = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 'A', 0, 'D', 0, 'C', 0, 'A', 0, 0],
    [0, 0, 'D', 0, 'C', 0, 'B', 0, 'A', 0, 0],
    [0, 0, 'D', 0, 'B', 0, 'A', 0, 'C', 0, 0],
    [0, 0, 'C', 0, 'D', 0, 'B', 0, 'B', 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const partOne = findLowestCost(partOneBurrow);
const partTwo = findLowestCost(partTwoBurrow);

console.log(`Part one: `, partOne);
console.log(`Part two: `, partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
