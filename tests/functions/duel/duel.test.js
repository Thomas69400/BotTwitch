const { duel } = require('../../../src/functions/duel');

// Mock des dépendances
const mockClient = {
  reply: jest.fn(),
  say: jest.fn(),
};
const mockTags = {
  'user-id': '123',
  username: 'TestUser',
  id: 'msg-123',
};

// Mock des fonctions
jest.mock('../../../src/functions/points', () => ({
  addPoints: jest.fn(),
  removePoints: jest.fn(),
  getViewer: jest.fn().mockReturnValue({ points: 100 }),
}));

describe('duel function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DUEL = '50';
    process.env.CHANNEL = 'testChannel';
    process.env.POINT_NAME = 'points';
  });

  it('should start a duel when no duel is active', () => {
    duel(mockClient, mockTags);
    expect(mockClient.say).toHaveBeenCalledWith(
      process.env.CHANNEL,
      `Un duel est en cours! Tape !duel pour défier ${mockTags.username} et tenter de remporter ${process.env.DUEL} ${process.env.POINT_NAME}.`,
    );
  });

  it('should reject a duel if the user has insufficient points', () => {
    // Mock getViewer to return a user with not enough points
    const { getViewer } = require('../../../src/functions/points');
    getViewer.mockReturnValueOnce({ points: 10 });

    // Start a duel
    duel(mockClient, mockTags);

    // Attempt to join the duel with insufficient points
    duel(mockClient, mockTags);

    expect(mockClient.reply).toHaveBeenCalledWith(
      process.env.CHANNEL,
      `T'as pas les thunes mon grand.`,
      mockTags.id,
    );
  });

  it('should declare a winner and exchange points', () => {
    const { addPoints, removePoints } = require('../../../src/functions/points');

    // Start a duel
    duel(mockClient, mockTags);

    // Mock a second player
    const mockTags2 = { ...mockTags, 'user-id': '456', username: 'Opponent' };
    duel(mockClient, mockTags2);

    // Check if a winner is declared and points are exchanged
    expect(mockClient.say).toHaveBeenCalled();
    expect(addPoints).toHaveBeenCalledTimes(1);
    expect(removePoints).toHaveBeenCalledTimes(1);
  });
});
