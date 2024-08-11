// Import Fonctions
import { deleteEmptyWords, resetCooldowns } from '../../../src/functions/whoWhyWhat';

// Mock de la fonction randomInt pour contrôler les réponses aléatoires
jest.mock('crypto', () => ({
  randomInt: jest.fn(),
}));

let client, channel;

beforeEach(() => {
  client = {
    reply: jest.fn(),
  };
  channel = 'testChannel';
  resetCooldowns();
  jest.clearAllMocks();
});

describe('deleteEmptyWords', () => {
  test('should remove empty words and reverse the array', () => {
    const input = ['', 'hello', '', 'world', ''];
    const expectedOutput = ['world', 'hello'];
    expect(deleteEmptyWords(input)).toEqual(expectedOutput);
  });
});
