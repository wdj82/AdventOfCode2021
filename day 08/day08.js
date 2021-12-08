// Advent of Code day 8
// https://adventofcode.com/2021/day/8

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

// const rawInput = `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`;

function partOne() {
    return rawInput
        .split('\n')
        .map((lines) => lines.split('|')[1])
        .map((output) => output.trim().split(' '))
        .reduce((acc, curr) => {
            curr.forEach((value) => {
                if ((value.length >= 2 && value.length <= 4) || value.length === 7) {
                    acc += 1;
                }
            });
            return acc;
        }, 0);
}
// console.log('The answer to part one is:', partOne());

// returns segments not found in both arrays
function intersection(array1, array2) {
    return array1.filter((x) => !array2.includes(x));
}

function findDigits(input) {
    // pull out the segments for the unique signals and the outputs, sorting them all
    const [signals, outputs] = input
        .split(' | ')
        .map((segments) => segments.split(' ').map((signal) => signal.split('').sort().join('')));

    const digits = {};
    const segments = { 2: [], 3: null, 4: null, 5: [], 6: [], 7: null };

    // need these two segments to find 2, 3, and 5
    let upperLeft = null;
    let lowerLeft = null;

    // group up the digits by length, saving 1, 4, 7, and 8
    signals.forEach((signal) => {
        if (signal.length === 2) {
            segments[2] = signal.split('');
            digits[signal] = '1';
        } else if (signal.length === 3) {
            segments[3] = signal.split('');
            digits[signal] = '7';
        } else if (signal.length === 4) {
            segments[4] = signal.split('');
            digits[signal] = '4';
        } else if (signal.length === 5) {
            segments[5].push(signal.split(''));
        } else if (signal.length === 6) {
            segments[6].push(signal.split(''));
        } else if (signal.length === 7) {
            segments[7] = signal.split('');
            digits[signal] = '8';
        }
    });

    // get the segments missing from 0, 6, and 9 by comparing with 8 (the six length segments each lack one segment)
    const missingSegments = segments[6].map((sixes) => [intersection(segments[7], sixes)[0], sixes.join('')]);

    // using the known segments from 1, 4, 7, 8 we can compare them to the missing segments of 0, 6, and 9
    // 1 gives the possible upper right and lower right segments
    // 4 has the upper left and middle after removing the segments from 1
    // 7 the top segment after removing the segments from 1 - the only segment we know for sure
    // 8 contains the bottom and lower left segments after removing the ones from 1, 4, and 7
    // 0 lacks the middle segment - locking in it and upper left from 4
    // 6 lacks the upper right - locking in it and lower right from 1
    // 9 lacks the lower left - locking in it and bottom from 8
    // with 7 locking in the upper segment from 1 all seven segments are known
    missingSegments.forEach(([segment, sixDigits]) => {
        if (segments[2].includes(segment)) {
            digits[sixDigits] = '6';
        } else if (segments[4].includes(segment)) {
            digits[sixDigits] = '0';
            segments[4] = intersection(segments[4], segments[2]);
            upperLeft = segments[4][0] === segment ? segments[4][1] : segments[4][0];
        } else if (segments[7].includes(segment)) {
            digits[sixDigits] = '9';
            const bottomAndLowerLeft = intersection(segments[7], [...segments[3], ...segments[4]]);
            lowerLeft = bottomAndLowerLeft[0] === segment ? bottomAndLowerLeft[0] : bottomAndLowerLeft[1];
        }
    });

    // knowing the upper left and lower left segments we can get the final digits of 2, 3, and 5 (the five length segments)
    segments[5].forEach((fives) => {
        if (fives.includes(upperLeft)) {
            digits[fives.join('')] = '5';
        } else if (fives.includes(lowerLeft)) {
            digits[fives.join('')] = '2';
        } else {
            digits[fives.join('')] = '3';
        }
    });

    // knowing all the digits now return the four digit output as a number
    const answer = outputs.map((output) => digits[output]).join('');
    return Number(answer);
}

// return the sum of all four digit output values
function partTwo() {
    return rawInput.split('\n').reduce((acc, input) => acc + findDigits(input), 0);
}

// console.log('The answer to part two is:', partTwo());
document.getElementById('partOne').appendChild(document.createTextNode(partOne()));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo()));
