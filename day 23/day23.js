// Advent of Code day 23
// https://adventofcode.com/2021/day/23

// const roomA = ['A', 'C'];
// const roomB = ['D', 'D'];
// const roomC = ['C', 'B'];
// const roomD = ['A', 'B'];

// const rooms = [
//     ['B', 'A'],
//     ['C', 'D'],
//     ['B', 'C'],
//     ['D', 'A'],
// ];

// const winningRooms = [
//     ['A', 'A'],
//     ['B', 'B'],
//     ['C', 'C'],
//     ['D', 'D'],
// ];

const burrow = [
    [1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1],
    [0, 0, 'B', 0, 'C', 0, 'B', 0, 'D', 0, 0],
    [0, 0, 'A', 0, 'D', 0, 'C', 0, 'A', 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
console.log(burrow);

// while the classes are not sorted
// go through each fish and move them one at a time after every move
// if no valid moves stop with that fish and go back to try the next one
// make sure they don't break the rules when moving
// if they're in the hallway they can only move into their room
// and only then if no other class is in the room
// cannot stop right outside the rooms
// space has to be empty to move in it
// keep track of costs for the move
// find all possible moves and return the lowest cost that sorts them
// special case if it's the in the right room and shouldn't move out
// recursive?
// maybe the first see if they can get into their desired room first

function isSorted() {
    return (
        burrow[1][2] === 'A' &&
        burrow[2][2] === 'A' &&
        burrow[1][4] === 'B' &&
        burrow[2][4] === 'B' &&
        burrow[1][6] === 'C' &&
        burrow[2][6] === 'C' &&
        burrow[1][8] === 'D' &&
        burrow[2][8] === 'D'
    );
}

// console.log(`Part one: `, 'dunno');
// console.log(`Part two: `, 'dunno');
document.getElementById('partOne').appendChild(document.createTextNode('dunno'));
document.getElementById('partTwo').appendChild(document.createTextNode('dunno'));
