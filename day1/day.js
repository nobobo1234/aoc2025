import { readFileSync } from 'fs';
import path from 'path';

function mod(n, m) {
    return ((n % m) + m) % m;
}

const input = readFileSync(path.join(__dirname, './input.txt')).toString().trim().split('\n')

export const countZeros = (input) => input.reduce((acc, curr) => {
    const [numOfZero, currentNum] = acc;

    const direction = curr[0] === 'L' ? -1 : 1;
    const num = parseInt(curr.substring(1))

    // Add the direction to the currentNum
    const newNum = mod(currentNum + direction * num, 100);

    return [numOfZero + !!(newNum === 0), newNum]
}, [0, 50])[0];


export const countInBetweenZeros = (input) => input.reduce((acc, curr) => {
    const [numOfZero, currentNum] = acc;

    const direction = curr[0] === 'L' ? -1 : 1;
    const num = parseInt(curr.substring(1))
    const combined = direction * mod(num, 100);

    // new Number without modulo.
    const newNum = currentNum + combined;

    // Checks if we pass 0 going forward. Backward will never be > 100.
    let forward = newNum >= 100

    // Checks if we pass 0 going backward. We always pass it when the new (non-
    // modulo number) is < 0. 0 - n doesnt count since we already went backward.
    let backward = newNum <= 0 && currentNum != 0;

    // Add it with the amount of 100's
    let inBetweenZeros = Math.floor(num / 100) + forward + backward;

    // Modulo the newNum by 100.
    return [numOfZero + inBetweenZeros, mod(newNum, 100)]
}, [0, 50])[0];

export const countInBetweenZerosEasy = (input) => input.reduce((acc, curr) => {
    const [numOfZero, currentNum] = acc;

    const direction = curr[0] === 'L' ? -1 : 1;
    const num = parseInt(curr.substring(1))

    let newNum = currentNum;

    let inBetweenZeros = 0;
    for (let i = 0; i < num; i++) {
        newNum = mod(newNum + direction, 100)

        if (newNum === 0) {
            inBetweenZeros++;
        }
    }

    return [numOfZero + inBetweenZeros, newNum]
}, [0, 50])[0];

console.log(countZeros(input))
console.log(countInBetweenZeros(input))
