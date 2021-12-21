// Advent of Code day 20
// https://adventofcode.com/2021/day/20

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

const searchDirections = [
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: -1 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
];

// return adjacent coordinates
function getNeighbors(currX, currY) {
    const result = [];

    for (let i = 0; i < searchDirections.length; i++) {
        const x = searchDirections[i].x + currX;
        const y = searchDirections[i].y + currY;
        result.push({ x, y });
    }
    return result;
}

const [algo, inputImage] = rawInput.split('\n\n');

const startingImage = inputImage.split('\n').map((line) => line.split(''));

// put the image into a grid with an extra two edges around it
function getImage(image) {
    const length = image.length + 4;

    const expandedImage = new Array(length);
    for (let i = 0; i < length; i++) {
        expandedImage[i] = new Array(length);
        // the edges start dark
        for (let j = 0; j < length; j++) {
            if (
                i === 0 ||
                i === 1 ||
                i === length - 1 ||
                i === length - 2 ||
                j === 0 ||
                j === 1 ||
                j === length - 1 ||
                j === length - 2
            ) {
                expandedImage[i][j] = '.';
            } else {
                // fill the center with the starting image
                expandedImage[i][j] = image[i - 2][j - 2];
            }
        }
    }
    return expandedImage;
}

function getEnhancedImage(image, edgePixel) {
    // new grid with extra border
    const enhancedImage = new Array(image.length + 2);
    for (let i = 0; i < enhancedImage.length; i++) {
        enhancedImage[i] = new Array(image.length + 2);
        enhancedImage[i][0] = edgePixel;
        enhancedImage[i][1] = edgePixel;
        enhancedImage[i][enhancedImage.length - 1] = edgePixel;
        enhancedImage[i][enhancedImage.length - 2] = edgePixel;
    }
    for (let i = 1; i < enhancedImage.length - 1; i++) {
        enhancedImage[0][i] = edgePixel;
        enhancedImage[1][i] = edgePixel;
        enhancedImage[enhancedImage.length - 1][i] = edgePixel;
        enhancedImage[enhancedImage.length - 2][i] = edgePixel;
    }

    let count = 0;

    for (let i = 1; i < image.length - 1; i++) {
        for (let j = 1; j < image.length - 1; j++) {
            const binary = getNeighbors(i, j)
                .map(({ x, y }) => (image[x][y] === '.' ? '0' : '1'))
                .join('');
            const enhancedPixel = algo[parseInt(binary, 2)];
            if (enhancedPixel === '#') {
                count += 1;
            }
            enhancedImage[i + 1][j + 1] = enhancedPixel;
        }
    }

    return { enhancedImage, count };
}

function enhance(maxSteps) {
    let enhancedImage = getImage(startingImage);
    const startPixel = algo[0];
    const endPixel = algo[511];
    let count;

    let edgePixel = startPixel;

    let step = 0;
    while (step < maxSteps) {
        ({ enhancedImage, count } = getEnhancedImage(enhancedImage, edgePixel));
        // if the binary for all zeroes is '#' in the algorithm check the binary for all ones
        edgePixel = edgePixel === '#' ? endPixel : startPixel;
        step += 1;
    }
    return count;
}

const partOne = enhance(2);
const partTwo = enhance(50);

console.log(`Part one: `, partOne);
console.log(`Part two: `, partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
