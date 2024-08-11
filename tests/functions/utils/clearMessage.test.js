import { clearMessage } from '../../../src/functions/utils';

// Test de la fonction clearMessage
describe('clearMessage', () => {
  test('clearMessage function nettoie le message correctement', () => {
    const message = '  Hello   \uD83D\uDE00 World  ';
    const cleanedMessage = clearMessage(message);
    expect(cleanedMessage).toBe('Hello World');
  });
});
