/* eslint-disable no-continue */
/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
// Advent of Code day 19
// https://adventofcode.com/2021/day/19

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

const rotations = [
    ([x, y, z]) => [x, y, z],
    ([x, y, z]) => [x, -y, -z],
    ([x, y, z]) => [x, z, -y],
    ([x, y, z]) => [x, -z, y],

    ([x, y, z]) => [-x, -y, z],
    ([x, y, z]) => [-x, y, -z],
    ([x, y, z]) => [-x, z, y],
    ([x, y, z]) => [-x, -z, -y],

    ([x, y, z]) => [y, z, x],
    ([x, y, z]) => [y, -z, -x],
    ([x, y, z]) => [y, x, -z],
    ([x, y, z]) => [y, -x, z],

    ([x, y, z]) => [-y, -z, x],
    ([x, y, z]) => [-y, z, -x],
    ([x, y, z]) => [-y, -x, -z],
    ([x, y, z]) => [-y, x, z],

    ([x, y, z]) => [z, x, y],
    ([x, y, z]) => [z, -x, -y],
    ([x, y, z]) => [z, y, -x],
    ([x, y, z]) => [z, -y, x],

    ([x, y, z]) => [-z, -x, y],
    ([x, y, z]) => [-z, x, -y],
    ([x, y, z]) => [-z, y, x],
    ([x, y, z]) => [-z, -y, -x],
];

function subVectors(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

function addVectors(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

const scanners = rawInput.split('\n\n').map((block) =>
    block
        .slice(block.indexOf(' ---') + 5)
        .split('\n')
        .map((line) => line.split(',').map(Number)),
);

function scan() {
    // first scanner is fixed orientation so add first and remove from list
    // as we find the correct orientation for other scanners they'll be added to the list
    const orientedScanners = [{ location: [0, 0, 0], orientedBeacons: scanners.shift(), isChecked: false }];

    while (scanners.length) {
        for (let i = 0; i < orientedScanners.length; ++i) {
            const { location, orientedBeacons, isChecked } = orientedScanners[i];
            if (!isChecked) {
                orientedScanners[i].isChecked = true;

                // removing from the scanners list so go in reverse order
                innerScannerLoop: for (let j = scanners.length - 1; j >= 0; j--) {
                    for (let k = 0; k < 24; k++) {
                        const rotatedBeacons = scanners[j].map((beacon) => rotations[k](beacon));
                        const foundDistances = {};

                        // check all the known beacons against every rotated beacon
                        for (let l = 0; l < orientedBeacons.length; l++) {
                            for (let m = 0; m < rotatedBeacons.length; m++) {
                                const distance = subVectors(orientedBeacons[l], rotatedBeacons[m]);
                                foundDistances[distance] = foundDistances[distance] + 1 || 1;

                                if (foundDistances[distance] >= 12) {
                                    scanners.splice(j, 1);

                                    orientedScanners.push({
                                        location: addVectors(location, distance),
                                        orientedBeacons: rotatedBeacons,
                                        isChecked: false,
                                    });

                                    // done with this scanner skip to the next one
                                    continue innerScannerLoop;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return orientedScanners;
}

function partOne(result) {
    const uniqueBeacons = new Set();
    for (let i = 0; i < result.length; i++) {
        const { location, orientedBeacons } = result[i];
        for (let j = 0; j < orientedBeacons.length; j++) {
            const [x, y, z] = orientedBeacons[j];
            uniqueBeacons.add(`${x + location[0]}, ${y + location[1]}, ${z + location[2]}`);
        }
    }
    return uniqueBeacons.size;
}

function partTwo(result) {
    let maxDistance = 0;
    for (let i = 0; i < result.length; i++) {
        const { location: outerLocation } = result[i];
        for (let j = 0; j < result.length; j++) {
            const { location: innerLocation } = result[j];
            maxDistance = Math.max(
                maxDistance,
                Math.abs(outerLocation[0] - innerLocation[0]) +
                    Math.abs(outerLocation[1] - innerLocation[1]) +
                    Math.abs(outerLocation[2] - innerLocation[2]),
            );
        }
    }
    return maxDistance;
}

const result = scan();

console.log(`Part one: `, partOne(result));
console.log(`Part two: `, partTwo(result));
document.getElementById('partOne').appendChild(document.createTextNode(partOne(result)));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo(result)));
