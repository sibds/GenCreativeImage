import { describe, expect, it } from 'vitest';
import { buildOpenRoadOrnamentPrompt } from './ornamentData.js';

const SYMBOLS = ['rhombus', 'wave', 'cross'];

function promptFor(composition) {
  return buildOpenRoadOrnamentPrompt({ symbols: SYMBOLS, composition });
}

describe('buildOpenRoadOrnamentPrompt', () => {
  it('puts COMPOSITION TYPE before selected symbols', () => {
    const prompt = promptFor('medallion');
    expect(prompt.indexOf('COMPOSITION TYPE')).toBeGreaterThanOrEqual(0);
    expect(prompt.indexOf('COMPOSITION TYPE')).toBeLessThan(prompt.indexOf('Selected symbols'));
  });

  it('omits filler words that make the model fill empty space', () => {
    for (const composition of ['tile', 'border', 'medallion', 'frame']) {
      const prompt = promptFor(composition);
      expect(prompt).not.toMatch(/8k/i);
      expect(prompt).not.toMatch(/high detail/i);
      expect(prompt).not.toMatch(/intricate/i);
      expect(prompt).not.toMatch(/masterpiece/i);
    }
  });

  it('builds an all-over seamless tile without a central focus', () => {
    const prompt = promptFor('tile');
    expect(prompt).toMatch(/COMPOSITION TYPE: ALL-OVER REPEATING ORNAMENT/);
    expect(prompt).toMatch(/seamless/i);
    expect(prompt).toMatch(/no dominant central/i);
    expect(prompt).toMatch(/repeatable ornamental modules/i);
    expect(prompt).toMatch(/Do not interpret this as a medallion, border or frame/);
  });

  it('builds a horizontal band with empty space above and below', () => {
    const prompt = promptFor('border');
    expect(prompt).toMatch(/COMPOSITION TYPE: HORIZONTAL ORNAMENTAL BORDER/);
    expect(prompt).toMatch(/20–30%/);
    expect(prompt).toMatch(/NO vertical repetition/);
    expect(prompt).toMatch(/rhythmic horizontal sequence/i);
    expect(prompt).toMatch(/Do not expand the ornament vertically/);
  });

  it('builds exactly one isolated medallion', () => {
    const prompt = promptFor('medallion');
    expect(prompt).toMatch(/COMPOSITION TYPE: ISOLATED CENTRAL MEDALLION/);
    expect(prompt).toMatch(/exactly ONE/i);
    expect(prompt).toMatch(/60–70%/);
    expect(prompt).toMatch(/NO carpet/);
    expect(prompt).toMatch(/single central focal point/i);
  });

  it('builds a perimeter frame with an empty center', () => {
    const prompt = promptFor('frame');
    expect(prompt).toMatch(/COMPOSITION TYPE: ORNAMENTAL FRAME WITH DECORATED CORNERS/);
    expect(prompt).toMatch(/central 65–75%/);
    expect(prompt).toMatch(/NO central medallion/);
    expect(prompt).toMatch(/primarily in corners/i);
    expect(prompt).toMatch(/Do not place a dominant symbol in the center/);
  });

  it('includes the selected symbol names', () => {
    const prompt = promptFor('tile');
    expect(prompt).toMatch(/Ромб/);
    expect(prompt).toMatch(/Волна \/ Река/);
    expect(prompt).toMatch(/Крест \/ Солнечный крест/);
  });
});
