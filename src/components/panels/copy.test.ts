import { describe, it, expect } from 'vitest';
import { shareCopy, adblockCopy, connectionCopy, chatCopy, tradeCopy } from './copy';

describe('Copy texts', () => {
  it('should have exact adblock texts', () => {
    expect(adblockCopy.inline).toBe('Disable your ad blocker to support Rajniti.io');
    expect(adblockCopy.modalTitle).toBe('Please disable your Adblocker');
    expect(adblockCopy.modalBody).toBe('Rajniti is free and wants to stay free. We use ad revenue to keep maintaining the game. Thanks! ❤');
  });

  it('should have exact connection texts', () => {
    expect(connectionCopy.bannerTitle).toBe('Connection lost');
    expect(connectionCopy.bannerBody).toBe('Make sure your internet connection is stable.');
  });

  it('should have exact share texts', () => {
    expect(shareCopy.copiedBtn).toBe('✓ Copied!');
  });
});
