// Import Fonctions
import {
  activeRevenue,
  addPoints,
  checkViewers,
  getViewers,
  reassignViewers,
} from '../../../src/functions/points';

import { liveAndRight } from '../../../src/functions/utils';

jest.mock('fs');
jest.mock('../../../src/functions/utils');
jest.mock('../../../src/functions/points', () => {
  const originalModule = jest.requireActual('../../../src/functions/points');
  return {
    ...originalModule, // conserve les autres fonctions originales
    addPoints: jest.fn(), // mock de la fonction spécifique
  };
});
jest.mock('../../../src/services/auth');

let originalEnv;

beforeAll(() => {
  originalEnv = { ...process.env };
  process.env.POINTS_JSON = 'points.test.json';
});

afterAll(() => {
  process.env = originalEnv;
});

beforeEach(() => {
  jest.clearAllMocks();
  reassignViewers(); // Réinitialiser les viewers
});
test('should add points to active viewers', async () => {
  liveAndRight.mockReturnValue(true);
  const tags = { 'user-id': '1', username: 'John' };
  checkViewers(tags);

  const initialPoints = getViewers()['1'].points;

  await activeRevenue();

  const updatedPoints = getViewers()['1'].points;
  expect(updatedPoints).toBeGreaterThan(initialPoints);
});

test('should not add points if viewer not active within 5 minutes', async () => {
  liveAndRight.mockReturnValue(true);

  reassignViewers({
    1: {
      id: '1',
      name: 'John',
      points: 10,
      lastActive: new Date(Date.now() - 6 * 60000),
    },
  });

  const initialPoints = getViewers()['1'].points;

  await activeRevenue();

  const updatedPoints = getViewers()['1'].points;
  expect(updatedPoints).toEqual(initialPoints);
});

test('should not add points if live is required and getLive returns false', async () => {
  liveAndRight.mockReturnValue(false);

  await activeRevenue();

  expect(liveAndRight).toHaveBeenCalled();
  expect(addPoints).not.toHaveBeenCalled();
});
