import { useCallback, useEffect, useRef, useState } from "react";

function clampYear(candidate: number, min: number, max: number) {
  const n = Number.isFinite(candidate) ? Math.floor(candidate) : min;
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

/**
 * Free 4-digit year typing (no number-input clamp fights). Clamps when the field has 4 digits or on blur.
 */
export function useYearField(initial: number, minYear: number, maxYear: number) {
  const safeInitial = clampYear(initial, minYear, maxYear);
  const [text, setText] = useState(() => String(safeInitial));
  const lastGoodRef = useRef(safeInitial);

  useEffect(() => {
    setText((prev) => {
      const n = Number.parseInt(prev.replace(/\D/g, ""), 10);
      if (!Number.isFinite(n)) {
        lastGoodRef.current = clampYear(safeInitial, minYear, maxYear);
        return String(lastGoodRef.current);
      }
      const y = clampYear(n, minYear, maxYear);
      lastGoodRef.current = y;
      return String(y);
    });
  }, [minYear, maxYear, safeInitial]);

  const effectiveYear = /^\d{4}$/.test(text)
    ? clampYear(Number.parseInt(text, 10), minYear, maxYear)
    : lastGoodRef.current;

  const onChange = useCallback(
    (raw: string) => {
      const digits = raw.replace(/\D/g, "").slice(0, 4);
      setText(digits);
      if (digits.length === 4) {
        const y = clampYear(Number.parseInt(digits, 10), minYear, maxYear);
        lastGoodRef.current = y;
        if (String(y) !== digits) setText(String(y));
      }
    },
    [minYear, maxYear],
  );

  const onBlur = useCallback(() => {
    if (text.length === 0 || !/^\d{4}$/.test(text)) {
      setText(String(lastGoodRef.current));
      return;
    }
    const y = clampYear(Number.parseInt(text, 10), minYear, maxYear);
    lastGoodRef.current = y;
    setText(String(y));
  }, [text, minYear, maxYear]);

  return { text, effectiveYear, onChange, onBlur };
}
