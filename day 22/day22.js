// Advent of Code day 22
// https://adventofcode.com/2021/day/22

// part two inspired from
// https://www.reddit.com/r/adventofcode/comments/rlxhmg/2021_day_22_solutions/hpjbx3t/

// import { smallExample as rawInput } from './rawInput.js';
// import { exampleInput as rawInput } from './rawInput.js';
// import { largeExample as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

const steps = rawInput.split('\n').map((line) => {
    let newLine;
    if (line.includes('on')) {
        newLine = [true, line.slice(3)];
    } else {
        newLine = [false, line.slice(4)];
    }
    newLine[1] = newLine[1].split(',').map((ranges) => ranges.slice(2).split('..').map(Number));
    return newLine;
});

function getCubeVolume([[xMin, xMax], [yMin, yMax], [zMin, zMax]]) {
    return (xMax - xMin + 1) * (yMax - yMin + 1) * (zMax - zMin + 1);
}

function intersect(cube1, cube2) {
    return cube1.map((axis, i) => [Math.max(axis[0], cube2[i][0]), Math.min(axis[1], cube2[i][1])]);
}

// finds the intersection volume of the cube against future cubes
// recursively checks that new volume against future cubes
// remove those intersecting volumes from the final volume of this cube
function overlap(cube, savedCubes) {
    return savedCubes
        .map((litCube, index) => {
            const newCube = intersect(cube, litCube);
            const doesIntersect = newCube.every(([min, max]) => max - min >= 0);
            return doesIntersect ? getCubeVolume(newCube) - overlap(newCube, savedCubes.slice(1 + index)) : 0;
        })
        .reduce((a, b) => a + b, 0);
}

// go through the steps backwards - skipping processing overlaps for turn off instructions
function partTwoCount() {
    return steps.reduceRight(
        ([savedCubeCount, processedCuboids], [isTurnOnInstruction, newCuboid]) => [
            isTurnOnInstruction
                ? savedCubeCount + getCubeVolume(newCuboid) - overlap(newCuboid, processedCuboids)
                : savedCubeCount,
            [...processedCuboids, newCuboid],
        ],
        [0, []],
    )[0];
}

// doesn't work for part two
function partOneCount() {
    const grid = new Map();
    steps.forEach(([turnOn, [[xMin, xMax], [yMin, yMax], [zMin, zMax]]]) => {
        for (let x = xMin; x <= xMax && x >= -50 && x <= 50; x++) {
            for (let y = yMin; y <= yMax && y >= -50 && y <= 50; y++) {
                for (let z = zMin; z <= zMax && z >= -50 && z <= 50; z++) {
                    const key = [x, y, z].join(',');
                    if (turnOn && !grid.has(key)) {
                        grid.set(key, true);
                    } else if (!turnOn && grid.has(key)) {
                        grid.delete(key);
                    }
                }
            }
        }
    });
    return grid.size;
}

const partOne = partOneCount();
const partTwo = partTwoCount();

console.log(`Part one: `, partOne);
console.log(`Part two: `, partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
