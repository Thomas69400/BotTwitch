import {
  setRaffleParticipants,
  getRaffleParticipants,
  resetRaffleParticipants,
} from '../../../src/functions/raffle';

describe('setRaffleParticipants', () => {
  beforeEach(() => {
    resetRaffleParticipants();
  });

  test('should add participants to the raffleParticipants array', () => {
    const participants = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];

    setRaffleParticipants(participants);

    expect(getRaffleParticipants()).toEqual(participants);
  });

  test('should append participants to the existing raffleParticipants array', () => {
    // Ajouter initialement Alice et Bob
    setRaffleParticipants([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);

    const newParticipants = [
      { id: 3, name: 'Charlie' },
      { id: 4, name: 'Dave' },
      { id: 5, name: 'Eve' },
    ];

    // Ajouter Charlie, Dave et Eve
    setRaffleParticipants(newParticipants);
    expect(getRaffleParticipants()).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
      { id: 4, name: 'Dave' },
      { id: 5, name: 'Eve' },
    ]);
  });
});
