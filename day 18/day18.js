// Advent of Code day 18
// https://adventofcode.com/2021/day/18

// import { exampleInput as rawInput } from './rawInput.js';
import { puzzleInput as rawInput } from './rawInput.js';

class Node {
    constructor(value, parent = null) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.parent = parent;
    }
}

function getSplitNode(node) {
    if (!node) {
        return null;
    }
    if (node.value >= 10) {
        return node;
    }
    return getSplitNode(node.left) || getSplitNode(node.right);
}

function getExplodeNode(node, depth = 0) {
    if (!node) {
        return null;
    }
    if (depth >= 4 && node.value === -1 && node.left.value !== -1 && node.right.value !== -1) {
        return node;
    }
    return getExplodeNode(node.left, depth + 1) || getExplodeNode(node.right, depth + 1);
}

function split(splittingNode) {
    const left = new Node(Math.floor(splittingNode.value / 2), splittingNode);
    const right = new Node(Math.ceil(splittingNode.value / 2), splittingNode);
    splittingNode.value = -1;
    splittingNode.left = left;
    splittingNode.right = right;
}

function explode(explodingNode) {
    const innerExplode = (node, prevNode, addVal, direction, goingUp) => {
        if (!node[direction]) return;

        if (node[direction] !== prevNode) {
            if (goingUp && node[direction].value === -1) {
                innerExplode(node[direction], null, addVal, direction === 'left' ? 'right' : 'left', false);
            } else if (node[direction].value === -1) {
                innerExplode(node[direction], null, addVal, direction, goingUp);
            } else {
                node[direction].value += addVal;
            }
        } else if (node.parent) {
            innerExplode(node.parent, node, addVal, direction, goingUp);
        }
    };

    const {
        left: { value: leftValue },
        right: { value: rightValue },
    } = explodingNode;
    explodingNode.left = null;
    explodingNode.right = null;
    explodingNode.value = 0;
    innerExplode(explodingNode.parent, explodingNode, leftValue, 'left', true);
    innerExplode(explodingNode.parent, explodingNode, rightValue, 'right', true);
}

// continue to reduce until no explodes or splits
function reduce(root) {
    let finished = false;
    while (!finished) {
        const explodeNode = getExplodeNode(root);
        const splitNode = getSplitNode(root);
        if (explodeNode) {
            explode(explodeNode);
        } else if (splitNode) {
            split(splitNode);
        } else {
            finished = true;
        }
    }
}

function calculateMagnitude(node) {
    if (node.value !== -1) {
        return node.value;
    }
    return 3 * calculateMagnitude(node.left) + 2 * calculateMagnitude(node.right);
}

function add(tree1, tree2) {
    const newRoot = new Node(-1, null);
    newRoot.left = tree1;
    newRoot.right = tree2;
    tree1.parent = newRoot;
    tree2.parent = newRoot;
    reduce(newRoot);
    return newRoot;
}

function makeTree(array, parent = null) {
    if (!Array.isArray(array)) {
        return null;
    }
    const root = new Node(-1, parent);
    if (Array.isArray(array[0])) {
        root.left = makeTree(array[0], root);
    } else {
        root.left = new Node(array[0], root);
    }
    if (Array.isArray(array[1])) {
        root.right = makeTree(array[1], root);
    } else {
        root.right = new Node(array[1], root);
    }

    return root;
}

const input = rawInput.split('\n').map(JSON.parse);

// part one
function getSumMagnitude() {
    let root = makeTree(input[0]);
    for (let i = 1; i < input.length; i++) {
        root = add(root, makeTree(input[i]));
    }

    return calculateMagnitude(root);
}

// part two
function getMaxMagnitude() {
    let maxMagnitude = 0;
    for (let i = 0; i < input.length; i++) {
        for (let j = i + 1; j < input.length; j++) {
            const leftPlusRight = add(makeTree(input[i]), makeTree(input[j]));
            const rightPlusLeft = add(makeTree(input[j]), makeTree(input[i]));
            maxMagnitude = Math.max(maxMagnitude, calculateMagnitude(leftPlusRight), calculateMagnitude(rightPlusLeft));
        }
    }
    return maxMagnitude;
}

const partOne = getSumMagnitude();
const partTwo = getMaxMagnitude();

console.log(`Part one: `, partOne);
console.log(`Part two: `, partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
