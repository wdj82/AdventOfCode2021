// Advent of Code day 12
// https://adventofcode.com/2021/day/12

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

function createGraph(input) {
    const graph = {};
    input.forEach((paths) => {
        const [a, b] = paths.split('-');
        if (!graph[a]) {
            graph[a] = [];
        }
        if (!graph[b]) {
            graph[b] = [];
        }
        graph[a].push(b);
        graph[b].push(a);
    });
    return graph;
}

function findAllPaths(graph, partTwo = false) {
    const start = 'start';
    const end = 'end';
    let pathCount = 0;

    // will recursively search through the graph for all possible paths from start to end
    // capital letter nodes can be visited multiple times but lower case nodes only once
    // for part two one lower case node can be visited twice
    function findPaths(node, path = [], hasVisitedSmallCaveTwice = false) {
        const nextPath = [...path, node];

        if (node === end) {
            // reached the end - add this as a viable path and go back up the tree
            pathCount += 1;
        } else {
            graph[node].forEach((neighbor) => {
                // don't revisit the start node
                if (neighbor !== start) {
                    if (
                        neighbor === neighbor.toLowerCase() &&
                        path.includes(neighbor) &&
                        !hasVisitedSmallCaveTwice &&
                        partTwo
                    ) {
                        // special case for part two - allow one extra visit to a lower case node
                        findPaths(neighbor, nextPath, true);
                    } else if (neighbor !== neighbor.toLowerCase() || !path.includes(neighbor)) {
                        findPaths(neighbor, nextPath, hasVisitedSmallCaveTwice);
                    }
                }
            });
        }
    }
    findPaths(start);
    return pathCount;
}

const graph = createGraph(rawInput.split('\n'));

const partOne = findAllPaths(graph);
const partTwo = findAllPaths(graph, true);

console.log(`Part one: `, partOne);
console.log(`Part two: `, partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
