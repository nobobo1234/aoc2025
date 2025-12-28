import { readFileSync } from 'fs';

const input = readFileSync('input.txt').toString().split("\n")
input.pop();

const part1 = (input) => {
    const ops = input.pop().trim().split(/[ ]+/);
    const lines = input.map(e => e.trim().split(/[ ]+/).map(Number))

    let count = 0;
    for (let i = 0; i < ops.length; i++) {
        count += lines.map(e => e[i])
            .reduce((acc, curr) => 
                ops[i] === '*' ? acc * curr : acc + curr, 
                ops[i] === '*' ? 1 : 0)
    }

    return count;
};

const part2 = (input) => {
    const ops = input.pop().trim().split(/[ ]+/);

    // Create an empty array with the length of 
    // all columns and fill it with each column and trim it.
    let toCurrs = Array.from({ length: input[0].length })
        .map((_, i) => input.map(row => row[i]).join('').trim())
        // A bit hacky but we join all the column rows with a ,. Then each
        // empty column '' will become ,,
        // For example ['246', '1', '5', '', '2'] will become 246,1,5,,2.
        .join(',')
        // Then we can split this by ,, so that we get a string with the numbers
        // for each operation which we can convert to actual numbers.
        .split(',,')
        .map(nums => nums.split(',').map(Number))

    // Reduce each column to its operation.
    let count = 0;
    for (let i = 0; i < ops.length; i++) {
        count += toCurrs[i]
            .reduce((acc, curr) => 
                ops[i] === '*' ? acc * curr : acc + curr, 
                ops[i] === '*' ? 1 : 0)
    }

    return count;
}

const exInput = `
123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   + `.trim().split("\n")
console.log("Example input: ", part1([...exInput]))
console.log("Real input: ", part1([...input]))

console.log("Example input", part2([...exInput]))
console.log("Example input", part2([...input]))
