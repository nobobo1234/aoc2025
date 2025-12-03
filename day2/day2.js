import { readFileSync } from 'fs';

const input = readFileSync('input.txt').toString().trim()

const part1 = (input) => {
    input = input.split(',').map(e => e.split('-').map(Number))
    let invalid = 0;
    for (const range of input) {
        for (let i = range[0]; i <= range[1]; i++) {
            let numAsString = `${i}`;
            let half = numAsString.length / 2;
            if (numAsString.substring(0, half) === numAsString.substring(half)) {
                invalid += i;
            }
        }
    }
    
    return invalid;
}

const part2 = (input) => {
    input = input.split(',').map(e => e.split('-').map(Number))
    let invalid = 0;
    for (const range of input) {
        for (let i = range[0]; i <= range[1]; i++) {
            let numAsString = `${i}`;
            const len = numAsString.length;
            for (let div = 2; div <= len; div++) {
                if (len % div === 0) {
                    const regExp = new RegExp(`.{1,${len / div}}`, 'g')
                    if ((new Set(numAsString.match(regExp))).size === 1) {
                        invalid += i;
                        break;
                    }
                }
            }
        }
    }
    
    return invalid;
}

console.log("Example")
console.log(part1('11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124'))
console.log("Input")
console.log(part1(input))

console.log("Example")
console.log(part2('11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124'))
console.log("Input")
console.log(part2(input))
