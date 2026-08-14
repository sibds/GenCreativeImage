import { afterEach, describe, expect, it, vi } from 'vitest';
import { createKioskIdleController } from './useKioskIdle.js';

describe('createKioskIdleController', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts a visible countdown immediately, then resets', () => {
    vi.useFakeTimers();
    const onTick = vi.fn();
    const onReset = vi.fn();
    const ctrl = createKioskIdleController({
      idleMs: 1000,
      onTick,
      onReset
    });

    ctrl.setArmed(true);
    expect(onTick).toHaveBeenLastCalledWith(1);
    expect(onReset).not.toHaveBeenCalled();

    vi.advanceTimersByTime(999);
    expect(onReset).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onReset).toHaveBeenCalledTimes(1);
    ctrl.dispose();
  });

  it('a gesture restarts the same visible countdown without hiding it', () => {
    vi.useFakeTimers();
    const onTick = vi.fn();
    const onReset = vi.fn();
    const ctrl = createKioskIdleController({
      idleMs: 1000,
      onTick,
      onReset
    });

    ctrl.setArmed(true);
    vi.advanceTimersByTime(600);
    ctrl.bump();
    expect(onTick).toHaveBeenLastCalledWith(1);
    expect(onTick.mock.calls.some((args) => args[0] === null)).toBe(false);

    vi.advanceTimersByTime(999);
    expect(onReset).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onReset).toHaveBeenCalledTimes(1);
    ctrl.dispose();
  });

  it('does not tick before a result (disarmed)', () => {
    vi.useFakeTimers();
    const onTick = vi.fn();
    const onReset = vi.fn();
    const ctrl = createKioskIdleController({
      idleMs: 100,
      onTick,
      onReset
    });

    vi.advanceTimersByTime(500);
    expect(onTick).not.toHaveBeenCalled();
    expect(onReset).not.toHaveBeenCalled();

    ctrl.setArmed(true);
    expect(onTick).toHaveBeenLastCalledWith(1);
    ctrl.setArmed(false);
    vi.advanceTimersByTime(500);
    expect(onReset).not.toHaveBeenCalled();
    expect(onTick).toHaveBeenLastCalledWith(null);
    ctrl.dispose();
  });
});
