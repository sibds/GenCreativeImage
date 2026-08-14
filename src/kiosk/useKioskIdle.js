import { useEffect, useRef, useState } from 'react';

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'touchstart'];

export function createKioskIdleController({
  idleMs,
  now = () => Date.now(),
  onTick,
  onReset,
  setIntervalFn = setInterval,
  clearIntervalFn = clearInterval
}) {
  let tickTimer = null;
  let deadline = 0;
  let armed = false;

  function clearTimers() {
    if (tickTimer != null) {
      clearIntervalFn(tickTimer);
      tickTimer = null;
    }
  }

  function tick() {
    const s = Math.ceil((deadline - now()) / 1000);
    if (s <= 0) {
      clearTimers();
      onTick?.(null);
      onReset?.();
      return;
    }
    onTick?.(s);
  }

  function startCountdown() {
    deadline = now() + idleMs;
    tick();
    tickTimer = setIntervalFn(tick, 250);
  }

  function bump() {
    if (!armed) return;
    clearTimers();
    startCountdown();
  }

  function setArmed(value) {
    armed = Boolean(value);
    if (!armed) {
      clearTimers();
      onTick?.(null);
      return;
    }
    startCountdown();
  }

  function dispose() {
    armed = false;
    clearTimers();
  }

  return { bump, setArmed, dispose };
}

export function useKioskIdle({ enabled, hasResult, idleMs, onReset }) {
  const [countdown, setCountdown] = useState(null);
  const onResetRef = useRef(onReset);
  onResetRef.current = onReset;

  useEffect(() => {
    if (!enabled || !hasResult) {
      setCountdown(null);
      return undefined;
    }

    const ctrl = createKioskIdleController({
      idleMs,
      onTick: setCountdown,
      onReset: () => onResetRef.current?.()
    });
    ctrl.setArmed(true);

    const bump = () => ctrl.bump();
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, bump, { passive: true }));

    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, bump));
      ctrl.dispose();
    };
  }, [enabled, hasResult, idleMs]);

  return countdown;
}
