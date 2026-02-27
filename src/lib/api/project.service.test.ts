import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockApiClient } = vi.hoisted(() => ({
  mockApiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('./client', () => ({
  default: mockApiClient,
}));

import { projectService } from './project.service';

describe('projectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches filtered project list', async () => {
    mockApiClient.get.mockResolvedValueOnce({ data: [{ id: 1, title: 'Project 1' }] });

    const result = await projectService.getProjects({ status: 'ONGOING', cause: 'Education' });

    expect(result).toHaveLength(1);
    expect(mockApiClient.get).toHaveBeenCalledTimes(1);
  });

  it('supports create/update/delete flow', async () => {
    mockApiClient.post.mockResolvedValueOnce({ data: { id: 10, title: 'Created' } });
    mockApiClient.put.mockResolvedValueOnce({ data: { id: 10, title: 'Updated' } });
    mockApiClient.delete.mockResolvedValueOnce({});

    const created = await projectService.createProject({
      title: 'Created',
      status: 'ONGOING',
    });
    const updated = await projectService.updateProject(10, { title: 'Updated' });
    await projectService.deleteProject(10);

    expect(created.id).toBe(10);
    expect(updated.title).toBe('Updated');
    expect(mockApiClient.delete).toHaveBeenCalledTimes(1);
  });
});
