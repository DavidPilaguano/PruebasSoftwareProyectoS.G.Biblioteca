import { describe, expect, it } from '@jest/globals';
import { AppService } from './app.service';

describe('AppService', () => {
  it('returns the hello message', () => {
    expect(new AppService().getHello()).toBe('Hello World!');
  });
});
