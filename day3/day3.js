import { readFileSync } from 'fs';

const input = readFileSync('input.txt').toString().trim()

const part1 = (input) => {
    input = input.split('\n').map(e => e.split('').map(Number));
    let sum = 0;
    for (const battery of input) {
        let nums = new Set(battery);
        let index = battery.length - 1;
        let maxOne = 0;
        while (index === battery.length - 1) {
            maxOne = Math.max(...nums);
            nums.delete(maxOne) 
            index = battery.indexOf(maxOne);
        }

        const rest = battery.slice(index + 1);
        const maxTwo = Math.max(...rest);
        sum += +`${maxOne}${maxTwo}`
    }
    return sum
}

const part2 = (input) => {
    input = input.split('\n').map(e => e.split('').map(Number));
    let sum = 0;
    for (const battery of input) {
        let maxs = [];
        let rest = battery;
        for (let i = 0; i < 12; i++) {
            let nums = new Set(rest.slice(0, rest.length -11 + i));
            let max = Math.max(...nums);
            let index = rest.indexOf(max);
            
            maxs.push(max);
            rest = rest.slice(index + 1);
        }
        
        sum += +maxs.join("");
    }
    return sum
}

console.log("Example");
let exInput = `987654321111111
811111111111119
234234234234278
818181911112111`
console.log(part1(exInput))

console.log("Input")
console.log(part1(input))

console.log("Example part 2")
console.log(part2(exInput))

console.log("Input part 2")
console.log(part2(input))
