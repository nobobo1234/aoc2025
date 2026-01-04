import { readFileSync } from 'fs';

const input = readFileSync('input.txt')
    .toString()
    .trim()
    .split("\n")
    .map(coordStr => coordStr.split(',').map(Number))

const part1 = (input) => {
    let maxSize = 0;
    for (const [x1, y1] of input) {
        for (const [x2, y2] of input) {
            const size = (1 + Math.abs(x1 - x2)) * (1 + Math.abs(y1 - y2));
            if (size > maxSize) {
                maxSize = size;
            }
        }
    }

    return maxSize;
}

const numsToIntervals = numArray => {
    let intervals = [];
    let prev = numArray[0];

    // Start with the currMin as the start
    let currMin = numArray.shift();

    // Start with the currMax at infinity
    let currMax = Infinity;
    let largeGap = false;


    for (let num of numArray) {
        // If the gap is larger than 1, we have a large gap.
        if (Math.abs(prev - num) > 1) {
            // If there's been a large gap before, add the interval because this
            // gap is outside the polygon and reset the currMin and currMax to num.
            if (largeGap === true) {
                intervals.push([currMin, currMax])
                currMin = num;
                currMax = num
                largeGap = false;
            } else {
                // If its the first time for a large gap update the largeGap so
                // the next large gap is counted as outside the polygon.
                currMax = num;
                largeGap = true; 
            }
        } else if (Math.abs(prev - num) === 0) {
            // If an edge goes directly up again, we need to set largeGap to true.
            currMax = num;
            largeGap = true;
        } else {
            // If it increases by 1 just update the currMax.
            currMax = num;
        }
        prev = num;
    }
    intervals.push([currMin, currMax])

    return intervals
}


const calcXsByY = (input) => {
    const map = new Map();
    for (const [cx, cy] of input) {
        if (!map.has(cy)) map.set(cy, [])
        map.get(cy).push(cx)
    }

    for (const [key, arr] of map.entries()) {
        // arr is sorted in place, no copy is made
        map.set(key, numsToIntervals(arr.sort((a, b) => a - b)))
    }

    return map;
}

const calcYsByX = (input) => {
    const map = new Map();
    for (const [cx, cy] of input) {
        if (!map.has(cx)) map.set(cx, [])
        map.get(cx).push(cy)
    }

    for (const [key, arr] of map.entries()) {
        // arr is sorted in place, no copy is made
        map.set(key, numsToIntervals(arr.sort((a, b) => a - b)))
    }

    return map;
}

const greenEdges = (input) => {
    let greens = [];
    for (let i = 0; i < input.length; i++) {
        const [x1, y1] = input[i];
        const [x2, y2] = i === input.length - 1 ? input[0] : input[i + 1];

        if (x1 - x2 === 0) {
            // y changed
            const start = Math.min(y1, y2) + 1;
            const newCoords = Array.from({ length: Math.abs(y1 - y2) - 1 })
                .map((_, i) => [x1, start + i])
            greens = greens.concat(newCoords);
        } else if (y1 - y2 === 0) {
            // x changed
            const start = Math.min(x1, x2) + 1;
            const newCoords = Array.from({ length: Math.abs(x1 - x2) - 1 })
                .map((_, i) => [start + i, y1])
            greens = greens.concat(newCoords);
        }
    }

    return greens;
}

const isRedOrGreen = (input, edge, xsByY, ysByX) => {
    if (!!input.has(edge)) {
        return true;
    }

    // edge is a string right now, split it.
    const [ex, ey] = edge.split(',').map(Number)

    // sameX contains all ys on the line x = ex;
    const sameX = ysByX.get(ex);

    // sameY contains all xs on the line y = ey;
    const sameY = xsByY.get(ey);

    return sameY.some(([minX, maxX]) => ex >= minX && ex <= maxX) && 
        sameX.some(([minY, maxY]) => ey >= minY && ey <= maxY);
}

const part2 = (input) => {
    let maxSize = 0;
    const edges = [...input, ...greenEdges(input)];

    // Also convert to a set for faster lookup.
    const edgesSet = new Set([...edges.map(coord => coord.join(','))])

    // Memoization Map for the isRedOrGreen function.
    const memoized = new Map();

    const xsByY = calcXsByY(edges)
    const ysByX = calcYsByX(edges)

    for (const [i, [x1, y1]] of input.entries()) {
        for (const [j, [x2, y2]] of input.entries()) {
            if (i > j) {
                // If i > j you don't need to check because [in[4], in[5]] is
                // the same as [in[5], in[4]]
                continue;
            }

            const toCheck = [
                [y1, [x1, x2].sort(), x1, [y1, y2].sort()],
                [y2, [x1, x2].sort(), x2, [y1, y2].sort()],
            ]

            let result = true;
            for (let [atY, [fromX, toX], atX, [fromY, toY]] of toCheck) {
                const xsAtY = xsByY.get(atY);
                const ysAtX = ysByX.get(atX);

                if (!xsAtY.some(([start, end]) => {
                    return fromX >= start && toX <= end;
                })) {
                    result = false;
                    break;
                }
                if (!ysAtX.some(([start, end]) => {
                    return fromY >= start && toY <= end;
                })) {
                    result = false;
                    break;
                }
            }

            // Check every edge until its false.
            if (result) {
                const size = (1 + Math.abs(x1 - x2)) * (1 + Math.abs(y1 - y2));
                if (size > maxSize) {
                    maxSize = size;
                }
            }
        }
    }

    return maxSize;
}


const exInput = `
7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3
`
    .toString()
    .trim()
    .split("\n")
    .map(coordStr => coordStr.split(',').map(Number))

console.log("Example part 1: ", part1(exInput))
console.log("Part 1: ", part1(input))

console.log("Example part 2: ", part2(exInput))
// console.log("Part 2: ", part2(input))
