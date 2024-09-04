import { commandes } from '../../../src/functions/utils';

// Test de la fonction commandes
describe('commandes', () => {
  test('commandes function retourne les bonnes instructions pour chaque commande', () => {
    process.env.CHANNEL = 'testChannel';
    process.env.TIMEOUT_BASE_COST = '100';

    expect(commandes('timeout')).toBe(
      `!timeout pseudo durée(minutes) ex: !timeout ${process.env.CHANNEL} 1 --> prix : ${process.env.TIMEOUT_BASE_COST}`,
    );
    expect(commandes('vip')).toBe(`!vip pseudo ex: !vip ${process.env.CHANNEL}`);
    expect(commandes()).toBe(
      'Commandes disponible: !timeout ; !points ; !classement ; !duel ; !gamble ; !vip ; !unvip',
    );
  });
});
