import { InternalServerErrorException } from '@nestjs/common';
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';

var mockCreateClient = jest.fn(() => ({ from: jest.fn() }));

jest.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient,
}));

jest.mock('ws', () => ({}));

const { SupabaseService } = require('./supabase.service') as typeof import('./supabase.service');

describe('SupabaseService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    mockCreateClient.mockClear();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('throws when credentials are missing', async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_KEY;

    expect(() => new SupabaseService()).toThrow(InternalServerErrorException);
  });

  it('creates and exposes the Supabase client', async () => {
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_KEY = 'service-key';

    const service = new SupabaseService();

    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'service-key',
      expect.objectContaining({
        auth: { persistSession: false },
        realtime: expect.any(Object),
      }),
    );
    expect(service.client).toEqual({ from: expect.any(Function) });
  });
});
