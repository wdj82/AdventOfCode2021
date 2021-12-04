import { exampleInput as rawInput } from './rawInput.js';

const [numbersString, ...boardStrings] = rawInput.split('\n\n');
const bingoNumbers = numbersString.split(',').map(Number);

function createBoard() {
    return boardStrings.map((string) => {
        const boardNumbersInfo = {};
        string
            .replace(/ {2,}/g, ' ') // remove double spaces
            .split('\n')
            .map((line, row) =>
                line
                    .trim()
                    .split(' ')
                    .map((num, column) => {
                        boardNumbersInfo[num] = { isMarked: false, row, column };
                        return Number(num);
                    }),
            );
        return {
            boardNumbersInfo, // each board's numbers marked status and it's row / column location
            rowMarkedNumbers: new Array(5).fill(0), // the number of marked numbers for each row
            columnMarkedNumbers: new Array(5).fill(0), // and column
        };
    });
}

function calculateScore({ boardNumbersInfo }, winningNumber) {
    // add up the unmarked board numbers
    const unmarkedNumbersSum = Object.keys(boardNumbersInfo).reduce((acc, curr) => {
        if (!boardNumbersInfo[curr].isMarked) {
            return acc + Number(curr);
        }
        return acc;
    }, 0);

    return unmarkedNumbersSum * winningNumber;
}

function bingo(boards, partTwo = false) {
    for (let i = 0; i < bingoNumbers.length; i++) {
        const number = bingoNumbers[i];
        for (let j = 0; j < boards.length; j++) {
            const board = boards[j];
            const boardNumberInfo = board.boardNumbersInfo[number];
            if (boardNumberInfo && !boardNumberInfo.isMarked) {
                // the board has this number update it
                boardNumberInfo.isMarked = true;
                const { row, column } = boardNumberInfo;
                board.rowMarkedNumbers[row] += 1;
                board.columnMarkedNumbers[column] += 1;
                if (board.rowMarkedNumbers[row] === 5 || board.columnMarkedNumbers[column] === 5) {
                    if (!partTwo) {
                        // we found the winning board
                        return calculateScore(board, number);
                    }

                    if (boards.length > 1) {
                        // remove the winning board from the board list
                        boards.splice(j, 1);
                        j -= 1;
                    } else {
                        // found the last winning board
                        return calculateScore(boards[0], number);
                    }
                }
            }
        }
    }
    throw new Error('Did not found the winning board');
}

console.log('Answer for part one is:', bingo(createBoard()));
console.log('Answer for part two is:', bingo(createBoard(), true));
