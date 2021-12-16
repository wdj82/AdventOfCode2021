// Advent of Code day 16
// https://adventofcode.com/2021/day/16

import { puzzleInput as rawInput } from './rawInput.js';

const input = rawInput.split('');

const convert = {
    0: '0000',
    1: '0001',
    2: '0010',
    3: '0011',
    4: '0100',
    5: '0101',
    6: '0110',
    7: '0111',
    8: '1000',
    9: '1001',
    A: '1010',
    B: '1011',
    C: '1100',
    D: '1101',
    E: '1110',
    F: '1111',
};

function getLiteral(packet, index) {
    let isEnd = false;
    let number = '';
    while (!isEnd) {
        const group = packet.slice(index, index + 5);
        if (group[0] === '0') {
            isEnd = true;
        }
        number += group.slice(1);
        index += 5;
    }
    return [parseInt(number, 2), index];
}

function calculate(id, numbers) {
    switch (id) {
        case 0:
            return numbers.reduce((acc, curr) => acc + curr, 0);
        case 1:
            return numbers.reduce((acc, curr) => acc * curr, 1);
        case 2:
            return Math.min(...numbers);
        case 3:
            return Math.max(...numbers);
        case 5:
            return numbers[0] > numbers[1] ? 1 : 0;
        case 6:
            return numbers[0] < numbers[1] ? 1 : 0;
        case 7:
            return numbers[0] === numbers[1] ? 1 : 0;
        default:
            throw new Error('unknown id type');
    }
}

// recursively parse the packet and it's sub-packets
let partOne = 0;
function getPacket(packet) {
    // sum the version numbers for part one
    partOne += parseInt(packet.slice(0, 3), 2);

    const typeId = parseInt(packet.slice(3, 6), 2);

    let index = 6;
    if (typeId === 4) {
        return getLiteral(packet, index);
    }

    // operator packet
    const numbers = [];
    const lengthTypeId = packet[index];
    index += 1;
    if (lengthTypeId === '0') {
        const length = parseInt(packet.slice(index, index + 15), 2);
        index += 15;
        const endIndex = index + length;

        while (index < endIndex) {
            const [number, newIndex] = getPacket(packet.slice(index));
            numbers.push(number);
            index += newIndex;
        }
    } else {
        const numSubPackets = parseInt(packet.slice(index, index + 11), 2);
        index += 11;
        let step = 0;

        while (step < numSubPackets) {
            const [number, newIndex] = getPacket(packet.slice(index));
            numbers.push(number);
            index += newIndex;
            step += 1;
        }
    }

    const finalValue = calculate(typeId, numbers);
    return [finalValue, index];
}

const packet = input.reduce((acc, hex) => acc + convert[hex], '');
const [partTwo] = getPacket(packet);

console.log(`Part one: `, partOne);
console.log(`Part two: `, partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
