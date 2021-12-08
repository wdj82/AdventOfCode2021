// Advent of Code day 6
// https://adventofcode.com/2021/day/6

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

const initialFishTimers = rawInput.split(',').map(Number);

function countFish(maxDays) {
    // save how many fish for each internal timer
    const fishTimers = new Array(9).fill(0);
    let totalFish = 0;
    let currentDay = 0;

    // assign the initial fishes to their timers
    for (let i = 0; i < initialFishTimers.length; i++) {
        fishTimers[initialFishTimers[i]] += 1;
        totalFish += 1;
    }
    // console.log(fishTimers);

    // Each day, all zero fish become sixes,
    // with the same number added to eight and the total fish count.
    // All other times decrement by one, excluding the new sixes and eights.
    while (currentDay < maxDays) {
        const newFish = fishTimers[0];
        totalFish += newFish;

        for (let i = 1; i <= 8; i++) {
            fishTimers[i - 1] = fishTimers[i];
        }

        fishTimers[8] = newFish;
        fishTimers[6] += newFish;

        currentDay += 1;
    }

    return totalFish;
}

// console.log('The answer to part one is:', countFish(80));
// console.log('The answer to part two is:', countFish(256));
document.getElementById('partOne').appendChild(document.createTextNode(countFish(80)));
document.getElementById('partTwo').appendChild(document.createTextNode(countFish(256)));
