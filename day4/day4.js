import { readFileSync } from 'fs';

const input = readFileSync('input.txt').toString().trim()

// A list of all the offsets for neighbors.
let neighborOffsets = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
]

const countPaperNeighbors = (array, r, c) => {
    const rows = array.length;
    const cols = array[0].length; 

    return neighborOffsets
            // Map offsets to actual coords
            .map(([i, j]) => ([r + i, c + j])) 
            // Filter out coords outside grid.
            .filter(([nr, nc]) => nr >= 0 && nr < rows && nc >= 0 && nc < cols)
            // Map coords to values
            .map(([nr, nc]) => array[nr][nc])
            // Count the amount of @'s'
            .reduce((acc, curr) => acc + (curr === '@'), 0)
}

const part1 = (input) => {
    const grid = input
        .split('\n')
        .map(row => row.split(''))

    let count = 0;
        
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === '@' && countPaperNeighbors(grid, r, c) < 4) {
                count++;
            }
        }
    }

    return count;
}

const part2 = (input) => {
    let grid = input
        .split('\n')
        .map(row => row.split(''))

    // Do a deep copy of the grid
    let newGrid = [...grid.map(e => [...e])]

    let prevCount = -1;
    let count = 0;

    while (prevCount != count) {
        prevCount = count;

        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[0].length; c++) {
                if (grid[r][c] === '@' && countPaperNeighbors(grid, r, c) < 4) {
                    newGrid[r][c] = 'x';
                    count++;
                }
            }
        }

        // Deepcopy the new grid;
        grid = [...newGrid.map(e => [...e])];
    }

    return count;
}

const exInput = `
..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.
`

console.log("Part 1 example answer: ", part1(exInput.trim()))
console.log("Part 1 answer: ", part1(input))

console.log("Part 2 example answer: ", part2(exInput.trim()))
console.log("Part 2 answer: ", part2(input))
