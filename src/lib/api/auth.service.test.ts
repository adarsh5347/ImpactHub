import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockApiClient } = vi.hoisted(() => ({
  mockApiClient: {
    post: vi.fn(),
  },
}));

vi.mock('./client', () => ({
  default: mockApiClient,
}));

import { authService } from './auth.service';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('stores token and volunteer session on successful volunteer login', async () => {
    mockApiClient.post.mockResolvedValueOnce({
      data: {
        token: 'jwt-token',
        userType: 'VOLUNTEER',
        email: 'vol@example.com',
        message: 'ok',
      },
    });

    const result = await authService.login('vol@example.com', 'password');

    expect(result.token).toBe('jwt-token');
    expect(localStorage.getItem('token')).toBe('jwt-token');
    expect(localStorage.getItem('currentVolunteer')).toContain('vol@example.com');
    expect(localStorage.getItem('currentNGO')).toBeNull();
  });

  it('throws on login failure without token', async () => {
    mockApiClient.post.mockResolvedValueOnce({
      data: {
        token: null,
        userType: null,
        email: null,
        message: 'Invalid credentials',
      },
    });

    await expect(authService.login('x@y.com', 'bad')).rejects.toThrow('Invalid credentials');
  });
});
