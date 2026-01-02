import { readFileSync } from 'fs';

const input = readFileSync('input.txt')
    .toString()
    .trim()
    .split("\n")
    .map(coordStr => coordStr.split(',').map(Number))

const calculateDistances = (input) => 
     [...input]
        .map(([x1, y1, z1]) => {
            // Map every coord to a list of distances to the coord.
            return [...input].map(([x2, y2, z2]) => {
                return Math.sqrt((x1 - x2) ** 2 + (y1 - y2)**2 + (z1 - z2) ** 2)
            })
        })
        // coords[i][j] === coords[j][i] so we slice matrix in the diagonal 
        // and exclude the diagonal.  
        .map((distList, i) => distList.slice(0, i))
        // Store indices instead of the coordinates to save space and improve
        // efficiecny in checking if elements are in circuits.
        .flatMap((distList, i) => distList.map((dist, j) => ([j, i, dist])))
        // Sort by dist in descending order because .pop() is faster than .shift()
        .sort(([_, _2, d1], [_3, _4, d2]) => d2 - d1)

const connectTwo = (numToCircuit, i1, i2, currCircuit) => {
    // If both are not present, create a new circuit, if one of both is present,
    // connect the new one to the existing circuit. If both are present and 
    // have different circuits we merge the circuits.
    let newCurrCircuit = currCircuit
    if (!numToCircuit.has(i1) && !numToCircuit.has(i2)) {
        newCurrCircuit++;
        numToCircuit.set(i1, currCircuit);
        numToCircuit.set(i2, currCircuit);
    } else if (!numToCircuit.has(i1) && numToCircuit.has(i2)) {
        const circOfi2 = numToCircuit.get(i2);
        numToCircuit.set(i1, circOfi2);
    } else if (numToCircuit.has(i1) && !numToCircuit.has(i2)) {
        const circOfi1 = numToCircuit.get(i1);
        numToCircuit.set(i2, circOfi1);
    } else if (numToCircuit.has(i1) && numToCircuit.has(i2) && numToCircuit.get(i1) !== numToCircuit.get(i2)) {
        // Change every i2 to the circuit number of i1
        [...numToCircuit.entries()]
            .filter(([_, circuit]) => circuit === numToCircuit.get(i2))
            .forEach(([index, _]) => {
                numToCircuit.set(index, numToCircuit.get(i1))
            });
    }

    return newCurrCircuit;
}

const part1 = (input, TO_CHECK) => {
    // Copy the input and create a 2D list with all the distances
    const distances = calculateDistances(input)

    let currCircuit = 0;

    // index => circuit mapping.
    let numToCircuit = new Map();
    for (let _ = 0; _ < TO_CHECK; _++) {
        const [i1, i2, _dist] = distances.pop()

        // Connect the two closest things. 
        // Edits numToCircuit implicitly!
        currCircuit = connectTwo(numToCircuit, i1, i2, currCircuit)
    }

    // Calculate the sizes of all circuits and sort in descending order.
    const circuits = [...numToCircuit.values()];
    const circuitSizes = [...(new Set(circuits))].map(circuit => {
        return circuits.filter(e => e === circuit).length;
    }).sort((a, b) => b - a);

    return circuitSizes[0] * circuitSizes[1] * circuitSizes[2];
}

const random = (array) => array[Math.floor(Math.random() * array.length)];

const randomMap = (map) => {
    const key = random([...map.keys()]);
    return [key, map.get(key)];
}

const popOrRandomDiff = (array, map) => {
    if (array.length > 0) {
        return array.pop();
    } else {
        const [randKey, randVal] = randomMap(map);
        const other = [...map.entries()].filter(e => e[1] !== randVal)
        return [randKey, random(other)[0], -1];
    }
}

const part2 = (input) => {
    // Copy the input and create a 2D list with all the distances
    const distances = calculateDistances(input)

    let currCircuit = 0;

    // index => circuit mapping.
    let numToCircuit = new Map();
    let answer = 0;
    while (true) {
        const [i1, i2, _dist] = popOrRandomDiff(distances, numToCircuit)

        // Connect the two closest things or two random things with different 
        // circuits.
        // Edits numToCircuit implicitly!
        currCircuit = connectTwo(numToCircuit, i1, i2, currCircuit)

        if ((new Set([...numToCircuit.values()])).size === 1 && numToCircuit.size === input.length) {
            answer = input[i1][0] * input[i2][0];
            break;
        }
    }

    return answer;
}

const exInput = `
162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689
`.trim()
    .split("\n")
    .map(coordStr => coordStr.split(',').map(Number))

console.log("Part 1 example: ", part1(exInput, 10))
console.log("Part 1: ", part1(input, 1000))

console.log("Part 2 example: ", part2(exInput));
console.log("Part 2: ", part2(input))
