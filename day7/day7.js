import { readFileSync } from 'fs';

const input = readFileSync('input.txt').toString().trim().split("\n")

const part1 = (input) => {
    // I don't know if making a Set is more efficient vs an array with elements
    // {x, y} and using Array#search() each time instead of splitters.includes.
    let beams = new Set([input[0].indexOf('S')]);

    let split = 0;
    let y = 1;
    while (y < input.length) {
        // If it hits a splitter, you split it.
        const currBeams = [...beams]
        for (const beam of currBeams) {
            if (input[y][beam] === '^') {
                beams.delete(beam);
                beams.add(beam - 1);
                beams.add(beam + 1);

                split++;                
            }
        }

        y++;
    }

    return split;
}

const part2 = (input) => {
    // We make the Set a Map so we can add weights so we know much much beams
    // are in this beam so to say.
    let beams = new Map();
    beams.set(input[0].indexOf('S'), 1);

    let y = 1;
    while (y < input.length) {
        const currBeams = [...beams]

        // Loop over the temporary currBeams, so you don't endlessly loop over 
        // the beams map which you update in the loop.
        for (const [newBeam, weight] of currBeams) {

            // If we hit a splitter we split it, update the weights.
            if (input[y][newBeam] === '^') {
                beams.delete(newBeam);
                const left = newBeam - 1;
                const right = newBeam + 1;
                beams.set(left, beams.has(left) ? beams.get(left) + weight : weight)
                beams.set(right, beams.has(right) ? beams.get(right) + weight : weight)
            }
        }

        y++;
    }

    return [...beams.values()].reduce((acc, curr) => acc + curr, 0);
}

const exInput = `
.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`.trim().split('\n')

console.log("Example input: ", part1(exInput))
console.log("Real input: ", part1(input))

console.log("Example input: ", part2(exInput))
console.log("Example input: ", part2(input))
