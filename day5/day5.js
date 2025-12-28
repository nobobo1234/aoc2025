import { readFileSync } from 'fs';

class Range {
    constructor(lower, upper) {
        this.lower = lower;
        this.upper = upper;
    }

    get size() {
        return this.upper - this.lower + 1;
    }

    contains(number) {
        return number >= this.lower && number <= this.upper;
    }

    isDisjointWith(range) {
        return range.lower - this.upper > 1;
    }

    // Returns a [merge] or [first, second] if elements didn't overlap/
    // couldn't be merged.
    union(otherRange) {
        const [first, second] = [this, otherRange]

        if (second.lower - first.upper > 1) {
            return [first, second];
        } else if (first.lower <= second.lower && first.upper >= second.upper) {
            return [first];
        } else {
            return [new Range(first.lower, second.upper)]
        }
    }
}

const input = readFileSync('input.txt').toString().trim()

const part1 = (input) => {
    let [rangesString, ingredientIdsString] = input.split('\n\n')

    const ranges = rangesString
        .split('\n')
        .map(e => new Range(...e.split('-').map(Number)))
    const ingredientIds = ingredientIdsString.split('\n').map(Number);

    let fresh = 0;
    for (const ingredientId of ingredientIds) {
        fresh += ranges.some(range => range.contains(ingredientId));
    }

    return fresh;
}

const part2 = (input) => {
    let [rangesString, _] = input.split('\n\n')

    // List of ranges that can be overlapping.
    const ranges = rangesString
        .split('\n')
        .map(e => new Range(...e.split('-').map(Number)))
        .sort((a, b) => a.lower - b.lower)

    // Total sum of sizes of ranges (inclusive).
    let count = 0;

    // Loop over all ranges backward "reduce" them. Then count.
    let current = ranges[0];
    for (const range of ranges) {
        if (current.isDisjointWith(range)) {
            count += current.size
            current = range;
        } else {
            current = current.union(range)[0];
        }
    }

    count += current.size;
    
    // Return its size
    return count;
}

const exInput = `
3-5
10-14
16-20
12-18
22-24

1
5
8
11
17
32
`

console.log("Part 1 example answer: ", part1(exInput.trim()))
console.log("Part 1 answer: ", part1(input))

console.log("Part 2 example answer: ", part2(exInput.trim()))
console.log("Part 2 answer: ", part2(input))
