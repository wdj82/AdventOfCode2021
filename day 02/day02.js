import rawInput from './rawInput.js';

// const rawInput = `forward 5
// down 5
// forward 8
// up 3
// down 8
// forward 2`;

function calcPositionPartOne(input) {
    const position = { horizontal: 0, depth: 0 };

    input.forEach(({ command, value }) => {
        switch (command) {
            case 'forward':
                position.horizontal += value;
                break;
            case 'down':
                position.depth += value;
                break;
            case 'up':
                position.depth -= value;
                break;
            default:
                throw new Error('unknown command');
        }
    });
    console.log(position);
    return position.horizontal * position.depth;
}

function calcPositionPartTwo(input) {
    const position = { horizontal: 0, depth: 0, aim: 0 };

    input.forEach(({ command, value }) => {
        switch (command) {
            case 'forward':
                position.horizontal += value;
                position.depth += position.aim * value;
                break;
            case 'down':
                position.aim += value;
                break;
            case 'up':
                position.aim -= value;
                break;
            default:
                throw new Error('unknown command');
        }
    });
    console.log(position);
    return position.horizontal * position.depth;
}

const input = rawInput.split('\n').map((instruction) => {
    const [command, value] = instruction.split(' ');
    return { command, value: Number(value) };
});

console.log('Part one solution is:', calcPositionPartOne(input));
console.log('Part two solution is:', calcPositionPartTwo(input));
