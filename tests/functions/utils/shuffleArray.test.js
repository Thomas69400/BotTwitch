import { shuffleArray } from '../../../src/functions/utils';

// Test de la fonction shuffleArray
describe('shuffleArray', () => {
  test('shuffleArray function randomize un array', () => {
    let array = [1, 2, 3, 4, 5];
    const originalArray = [...array];

    array = shuffleArray(array);

    // Check if the array is shuffled
    expect(array).not.toEqual(originalArray);
    // Check if the array has the same elements
    expect(array.toSorted((a, b) => a - b)).toEqual(originalArray);
  });
});
