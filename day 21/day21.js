// Advent of Code day 21
// https://adventofcode.com/2021/day/21

class Player {
    constructor(position, score = 0) {
        this.score = score;
        this.position = position;
    }

    playTurn(rolls) {
        this.position += rolls;

        if (this.position % 10 === 0) {
            this.position = 10;
        } else if (this.position > 10) {
            this.position %= 10;
        }

        this.score += this.position;
    }

    isWinner(partTwo = false) {
        if (partTwo) {
            return this.score >= 21;
        }
        return this.score >= 1000;
    }
}

// part one
function playDeterministicGame() {
    let dieCount = 0;
    let die = 0;
    function rollDie() {
        let dieSum = 0;
        for (let i = 0; i < 3; i++) {
            die += 1;
            dieCount += 1;
            if (die > 100) {
                die = 1;
            }
            dieSum += die;
        }
        return dieSum;
    }

    // const playerOne = new Player(4);
    // const playerTwo = new Player(8);
    const playerOne = new Player(9);
    const playerTwo = new Player(6);

    while (!playerOne.isWinner() && !playerTwo.isWinner()) {
        playerOne.playTurn(rollDie());
        if (!playerOne.isWinner()) {
            playerTwo.playTurn(rollDie());
        }
    }

    if (playerOne.isWinner()) {
        return playerTwo.score * dieCount;
    }
    return playerOne.score * dieCount;
}

// the number of possible rolls for each 3 die sum ([1,1,1],[1,1,2]...[3,3,2],[3,3,3])
const possibleRollCounts = { 3: 1, 4: 3, 5: 6, 6: 7, 7: 6, 8: 3, 9: 1 };

function playTurn(rolls, position, score) {
    position += rolls;

    if (position % 10 === 0) {
        position = 10;
    } else if (position > 10) {
        position %= 10;
    }

    score += position;
    return { newPosition: position, newScore: score };
}

// part two
function playDiracGame() {
    let universes = new Map();

    // key is the game state (playerOnePosition, playerOneScore, playerTwoPosition, playerTwoScore)
    // value is number of universes with key's game state
    // universes.set(`4,0,8,0`, 1);
    universes.set(`9,0,6,0`, 1);

    let playerOneWinningUniverses = 0;
    let playerTwoWinningUniverses = 0;
    let playerTurn = 1;

    // for every universe check all possible dice rolls for winning state
    // if no winning state create new universes for every possible die roll
    while (universes.size) {
        const newUniverses = new Map();
        universes.forEach((universeCount, gameStateKey) => {
            const [playerOnePosition, playerOneScore, playerTwoPosition, playerTwoScore] = gameStateKey
                .split(',')
                .map(Number);

            for (let dieRollSum = 3; dieRollSum <= 9; dieRollSum++) {
                let newPosition;
                let newScore;
                if (playerTurn === 1) {
                    ({ newPosition, newScore } = playTurn(dieRollSum, playerOnePosition, playerOneScore));
                } else {
                    ({ newPosition, newScore } = playTurn(dieRollSum, playerTwoPosition, playerTwoScore));
                }

                const newUniversesCount = possibleRollCounts[dieRollSum] * universeCount;

                if (newScore >= 21) {
                    if (playerTurn === 1) {
                        playerOneWinningUniverses += newUniversesCount;
                    } else {
                        playerTwoWinningUniverses += newUniversesCount;
                    }
                } else {
                    // game state didn't win add to newUniverses for next turn
                    let key;
                    if (playerTurn === 1) {
                        key = `${newPosition},${newScore},${playerTwoPosition},${playerTwoScore}`;
                    } else {
                        key = `${playerOnePosition},${playerOneScore},${newPosition},${newScore}`;
                    }

                    // check if any new universes with this key already exist in the map
                    const count = newUniverses.get(key);
                    if (count) {
                        newUniverses.set(key, count + newUniversesCount);
                    } else {
                        newUniverses.set(key, newUniversesCount);
                    }
                }
            }
        });
        // swap players and go again until all universes reach a winning state
        playerTurn = playerTurn === 1 ? 2 : 1;
        universes = newUniverses;
    }
    return Math.max(playerOneWinningUniverses, playerTwoWinningUniverses);
}

const partOne = playDeterministicGame();
const partTwo = playDiracGame();

console.log(`Part one: `, partOne);
console.log(`Part two: `, partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
