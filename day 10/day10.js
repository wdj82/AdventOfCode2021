// Advent of Code day 10
// https://adventofcode.com/2021/day/10

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

function findScores(chunk) {
    const expectedCharsStack = [];
    const matchingChars = { '(': ')', '[': ']', '{': '}', '<': '>' };
    const syntaxScores = { ')': 3, ']': 57, '}': 1197, '>': 25137 };

    for (let i = 0; i < chunk.length; i++) {
        const currChar = chunk[i];

        if (matchingChars[currChar]) {
            // push the future expected closing character onto the stack
            expectedCharsStack.push(matchingChars[currChar]);
        } else {
            // make sure the current closing character matches what the next expected is
            const expectedChar = expectedCharsStack.pop();

            // didn't get the correct closing character - return the found chars syntax score
            if (expectedChar !== currChar) {
                return { syntaxScore: syntaxScores[currChar], autoCompleteSum: 0 };
            }
        }
    }

    // didn't find any errors so the chunk is incomplete
    const autoCompleteScores = { ')': 1, ']': 2, '}': 3, '>': 4 };
    let autoCompleteSum = 0;

    // score the unused characters from the stack
    while (expectedCharsStack.length) {
        const expectedChar = expectedCharsStack.pop();
        autoCompleteSum = 5 * autoCompleteSum + autoCompleteScores[expectedChar];
    }

    return { autoCompleteSum, syntaxScore: 0 };
}

function getScores() {
    const chunks = rawInput.split('\n').map((line) => line.split(''));
    const autoCompleteScores = [];
    let syntaxSum = 0;

    // get either the autocompleteScore or syntax score for each chunk
    chunks.forEach((currChunk) => {
        const { autoCompleteSum, syntaxScore } = findScores(currChunk);

        if (autoCompleteSum) {
            autoCompleteScores.push(autoCompleteSum);
        } else {
            syntaxSum += syntaxScore;
        }
    });

    // winning autocomplete score is the middle of all sorted scores
    autoCompleteScores.sort((a, b) => b - a);
    const middle = Math.floor(autoCompleteScores.length / 2);

    return { partOne: syntaxSum, partTwo: autoCompleteScores[middle] };
}

const { partOne, partTwo } = getScores();

// console.log(`Part one: `, partOne);
// console.log(`Part two: `, partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
