import { readFileSync } from 'fs';

const input = readFileSync('input.txt').toString().trim().split("\n")

const increaseCoord = (coord, dx, dy) => {
    const [x, y] = coord.split(',').map(Number);
    return [x + dx, y + dy].join(',');
}

const part1 = (input) => {
    // I don't know if making a Set is more efficient vs an array with elements
    // {x, y} and using Array#search() each time instead of splitters.includes.
    let beams = new Set([`${input[0].indexOf('S')},0`]);

    let splitters = []
    for (const [i, str] of input.entries()) {
        // Match all the ^ in the current row, and map it to coordinates using
        // the index parameter in each match.
        const rowSplitters = [...str.matchAll(/(\^)/g)].map(e => (`${e['index']},${i}`))

        splitters = [...splitters, ...rowSplitters]
    }

    let split = 0;
    let y = 1;
    while (y < input.length) {
        // If it hits a splitter, you split it.
        const currBeams = [...beams]
        for (const beam of currBeams) {
            let newBeam = increaseCoord(beam, 0, 1);
            beams.delete(beam);
            beams.add(newBeam);

            if (splitters.includes(newBeam)) {
                beams.delete(newBeam);
                beams.add(increaseCoord(newBeam, -1, 0));
                beams.add(increaseCoord(newBeam, 1, 0));

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
    beams.set(`${input[0].indexOf('S')},0`, 1);

    let splitters = []
    for (const [i, str] of input.entries()) {
        // Match all the ^ in the current row, and map it to coordinates using
        // the index parameter in each match.
        const rowSplitters = [...str.matchAll(/(\^)/g)].map(e => (`${e['index']},${i}`))

        splitters = [...splitters, ...rowSplitters]
    }

    let y = 1;
    while (y < input.length) {
        // Change the map so moves every beam down by 1. We need to do this
        // before the loop because otherwise you can miss a "double split" where
        // you check for a beam that should be there but hasn't been moved
        // down by 1 yet.
        let currBeams = [...beams]
            .map(([beam, weight]) => [increaseCoord(beam, 0, 1), weight]);
        // Update the beams.
        beams = new Map(currBeams)

        // Loop over the temporary currBeams, so you don't endlessly loop over 
        // the beams map which you update in the loop.
        for (const [newBeam, weight] of currBeams) {
            // If we hit a splitter we split it, update the weights.
            if (splitters.includes(newBeam)) {
                beams.delete(newBeam);
                const left = increaseCoord(newBeam, -1, 0);
                const right = increaseCoord(newBeam, 1, 0);
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
