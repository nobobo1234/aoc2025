import { expect, test } from 'vitest';
import { countInBetweenZeros } from './day';

test('from < 50 to L >= 50', () => {
    expect(countInBetweenZeros(['L1', 'L50'])).toBe(1);
    expect(countInBetweenZeros(['L1', 'L100'])).toBe(1);
    expect(countInBetweenZeros(['L1', 'L150'])).toBe(2);
    expect(countInBetweenZeros(['L1', 'L200'])).toBe(2);
    expect(countInBetweenZeros(['L1', 'L250'])).toBe(3);
})

test('from < 50 to L < 50', () => {
    expect(countInBetweenZeros(['L1', 'L10'])).toBe(0);
    expect(countInBetweenZeros(['L1', 'L20'])).toBe(0);
    expect(countInBetweenZeros(['L1', 'L48'])).toBe(0);
    expect(countInBetweenZeros(['L1', 'L49'])).toBe(1);
})

test('from < 50 to R >= 50', () => {
    expect(countInBetweenZeros(['L1', 'R51'])).toBe(1);
    expect(countInBetweenZeros(['L1', 'R52'])).toBe(1);
    expect(countInBetweenZeros(['L1', 'R152'])).toBe(2);
})

test('from < 50 to R <= 50', () => {
    expect(countInBetweenZeros(['L1', 'R50'])).toBe(0);
    expect(countInBetweenZeros(['L1', 'R30'])).toBe(0);
})

test('from > 50 to R >= 50', () => {
    expect(countInBetweenZeros(['R1', 'R50'])).toBe(1);
    expect(countInBetweenZeros(['R1', 'R100'])).toBe(1);
    expect(countInBetweenZeros(['R1', 'R150'])).toBe(2);
})

test('from 0 to -n or +n', () => {
    expect(countInBetweenZeros(['L50', 'L1'])).toBe(1);
    expect(countInBetweenZeros(['L50', 'R1'])).toBe(1);
    expect(countInBetweenZeros(['R50', 'L1'])).toBe(1);
    expect(countInBetweenZeros(['R50', 'R1'])).toBe(1);

    expect(countInBetweenZeros(['L50', 'L100'])).toBe(2);
    expect(countInBetweenZeros(['L50', 'R100'])).toBe(2);
    expect(countInBetweenZeros(['R50', 'L100'])).toBe(2);
    expect(countInBetweenZeros(['R50', 'R100'])).toBe(2);
})
