import { checkRole } from '../../../src/functions/utils';

// Test de la fonction checkRole
describe('Checkrole', () => {
  test('checkRole function returne le role en fonction des tags', () => {
    const broadcasterTags = { badges: { broadcaster: 1 }, mod: false };
    const modTags = { badges: {}, mod: true };
    const viewerTags = { badges: {}, mod: false };

    expect(checkRole(broadcasterTags)).toBe(2);
    expect(checkRole(modTags)).toBe(1);
    expect(checkRole(viewerTags)).toBe(0);
  });
});
