// Advent of Code day 7
// https://adventofcode.com/2021/day/7

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

function findLeastFuel() {
    // save how many crabs are on each level and find the max level in the array
    const crabLevelsArray = rawInput.split(',').map(Number);
    let maxLevel = 0;
    const crabsPerLevel = {};
    for (let i = 0; i < crabLevelsArray.length; i++) {
        const level = crabLevelsArray[i];

        crabsPerLevel[level] = crabsPerLevel[level] + 1 || 1;

        maxLevel = Math.max(maxLevel, level);
    }

    // saving part one and part two answers in an array
    const minFuelCosts = [Number.MAX_VALUE, Number.MAX_VALUE];

    // calculate the fuel cost to move all crabs to each possible level, returning the smallest cost
    // would have been faster to find the medium for part one and mean for part two
    for (let targetLevel = 0; targetLevel <= maxLevel; targetLevel++) {
        const fuelCosts = [0, 0];

        Object.entries(crabsPerLevel).forEach(([level, numOfCrabs]) => {
            const distance = Math.abs(targetLevel - level);
            // part one cost
            fuelCosts[0] += distance * numOfCrabs;
            // part two cost - add up the consecutive steps to the target level for each crab
            fuelCosts[1] += ((distance * (distance + 1)) / 2) * numOfCrabs;
        });

        minFuelCosts[0] = Math.min(minFuelCosts[0], fuelCosts[0]);
        minFuelCosts[1] = Math.min(minFuelCosts[1], fuelCosts[1]);
    }
    return minFuelCosts;
}

const [partOneMinFuelCost, partTwoMinFuelCost] = findLeastFuel();
// console.log('The answer to part one is:', partOneMinFuelCost);
// console.log('The answer to part two is:', partTwoMinFuelCost);
document.getElementById('partOne').appendChild(document.createTextNode(partOneMinFuelCost));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwoMinFuelCost));
