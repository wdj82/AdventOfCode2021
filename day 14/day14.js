// Advent of Code day 14
// https://adventofcode.com/2021/day/14

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

function makePolymer(maxStep) {
    const [template, rawPairs] = rawInput.split('\n\n');

    let pairCounts = {};

    // create initial pairs and their counts from template
    template.split('').forEach((char, index, array) => {
        if (array[index + 1]) {
            const pair = char + array[index + 1];
            pairCounts[pair] = (pairCounts[pair] ?? 0) + 1;
        }
    });

    // save what the two new pairs will be for each pair based on the rules
    const nextPairs = rawPairs.split('\n').reduce((acc, rule) => {
        const [left, right] = rule.split(' -> ');
        acc[left] = [left[0] + right, right + left[1]];
        return acc;
    }, {});

    // for each step create the new pairs from the current pairs
    // e.g. NN becomes NC and CN in new list times the number of NNs there are
    let step = 0;
    while (step < maxStep) {
        const nextPairCounts = {};
        Object.entries(pairCounts).forEach(([pair, amount]) => {
            const [firstPair, secondPair] = nextPairs[pair];
            nextPairCounts[firstPair] = (nextPairCounts[firstPair] ?? 0) + amount;
            nextPairCounts[secondPair] = (nextPairCounts[secondPair] ?? 0) + amount;
        });
        pairCounts = nextPairCounts;

        step += 1;
    }

    // find the most and least polymers for the output
    const count = {};
    count[template[0]] = 1;
    Object.entries(pairCounts).forEach(([[, letter], amount]) => {
        count[letter] = (count[letter] ?? 0) + amount;
    });
    const countArray = Object.values(count);

    return Math.max(...countArray) - Math.min(...countArray);
}

const partOne = makePolymer(10);
const partTwo = makePolymer(40);
console.log(`Part one: `, partOne);
console.log(`Part two: `, partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
