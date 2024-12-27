import { describe, it, expect, vi } from 'vitest';
import { EsaMCPServer } from './index';
import axios from 'axios';

vi.mock('axios');

describe('EsaMCPServer', () => {
  it('should initialize with access token', async () => {
    const server = new EsaMCPServer();
    const initResult = await server.request({
      method: 'prompts/init',
      params: {
        accessToken: 'test-token',
        teamName: 'test-team'
      }
    });
    expect(initResult.success).toBe(true);
  });

  it('should list resources', async () => {
    const mockPosts = {
      posts: [
        {
          number: 1,
          name: 'Test Post',
          category: 'test',
          tags: ['tag1', 'tag2']
        }
      ]
    };

    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockPosts });

    const server = new EsaMCPServer();
    await server.request({
      method: 'prompts/init',
      params: {
        accessToken: 'test-token',
        teamName: 'test-team'
      }
    });

    const result = await server.request({
      method: 'resources/list',
      params: {}
    });

    expect(result.resources).toHaveLength(1);
    expect(result.resources[0]).toMatchObject({
      uri: 'esa://test-team/posts/1',
      name: 'Test Post'
    });
  });

  it('should read a post', async () => {
    const mockPost = {
      number: 1,
      body_md: '# Test Content'
    };

    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockPost });

    const server = new EsaMCPServer();
    await server.request({
      method: 'prompts/init',
      params: {
        accessToken: 'test-token',
        teamName: 'test-team'
      }
    });

    const result = await server.request({
      method: 'resources/read',
      params: {
        uri: 'esa://test-team/posts/1'
      }
    });

    expect(result.contents[0]).toMatchObject({
      mimeType: 'text/markdown',
      text: '# Test Content'
    });
  });
});