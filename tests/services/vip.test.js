// Import Package
import axios from 'axios';

// Import Services
import { getOauthToken } from '../../src/services/auth';
import { serviceVip } from '../../src/services/vip';

jest.mock('axios');
jest.mock('../../src/services/auth');

describe('serviceVip', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Nettoie les mocks avant chaque test
  });

  it('devrait ajouter le rôle VIP avec succès', async () => {
    // Mock de getOauthToken pour retourner un token fictif
    getOauthToken.mockResolvedValue('fake_token');

    // Mock de la requête POST réussie
    axios.post.mockResolvedValue({ status: 200 });

    const status = await serviceVip(12345, true);

    expect(getOauthToken).toHaveBeenCalledWith(false);
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/channels/vips?broadcaster_id=undefined&user_id=12345',
      {},
      { headers: { Authorization: 'Bearer fake_token', 'Client-Id': undefined } },
    );
    expect(status).toBe(200);
  });

  it('devrait retirer le rôle VIP avec succès', async () => {
    // Mock de getOauthToken pour retourner un token fictif
    getOauthToken.mockResolvedValue('fake_token');

    // Mock de la requête DELETE réussie
    axios.delete.mockResolvedValue({ status: 204 });

    const status = await serviceVip(12345, false);

    expect(getOauthToken).toHaveBeenCalledWith(false);
    expect(axios.delete).toHaveBeenCalledWith(
      'https://api.twitch.tv/helix/channels/vips?broadcaster_id=undefined&user_id=12345',
      { headers: { Authorization: 'Bearer fake_token', 'Client-Id': undefined } },
    );
    expect(status).toBe(204);
  });

  it("devrait retourner le status de l'erreur si la requête échoue", async () => {
    // Mock de getOauthToken pour retourner un token fictif
    getOauthToken.mockResolvedValue('fake_token');

    // Mock d'une requête échouée
    axios.post.mockRejectedValue({
      response: { data: { status: 403 } },
    });

    const status = await serviceVip(12345, true);

    expect(status).toBe(403);
  });
});
