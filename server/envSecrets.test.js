import { describe, expect, it } from 'vitest';
import { overlayUnexpandedSecrets } from './envSecrets.js';

describe('overlayUnexpandedSecrets', () => {
  it('keeps $ in SMTP_PASS that dotenv-expand would swallow', () => {
    const expanded = { SMTP_PASS: '+GIbi5vpn' };
    const source = 'SMTP_PASS=+GIbi5vpn$IH_KO6\nSMTP_USER=print@example.com\n';
    const out = overlayUnexpandedSecrets(expanded, source);
    expect(out.SMTP_PASS).toBe('+GIbi5vpn$IH_KO6');
    expect(out.SMTP_USER).toBe('print@example.com');
  });

  it('strips surrounding quotes without expanding', () => {
    const out = overlayUnexpandedSecrets({}, "SMTP_PASS='p@ss$word'\n");
    expect(out.SMTP_PASS).toBe('p@ss$word');
  });
});
