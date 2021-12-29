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

// Dijkstra's
export default function getPaths([startingX, startingY], burrow) {
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
