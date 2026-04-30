/**
 * CPI-U (All Urban Consumers), U.S. city average annual index —
 * anchors for interpolation when Fred is unavailable or between releases.
 */
export const CPI_ANCHOR_PAIRS: Array<[year: number, index: number]> = [
  [1947, 22.332],
  [1950, 23.957],
  [1955, 26.761],
  [1960, 29.558],
  [1965, 31.522],
  [1970, 38.842],
  [1975, 53.815],
  [1980, 82.383],
  [1985, 107.6],
  [1990, 130.708],
  [1995, 152.383],
  [2000, 172.224],
  [2005, 195.264],
  [2010, 218.055],
  [2015, 237.017],
  [2020, 259.759],
  [2024, 317.671],
];

export function yearlySeriesFromAnchors(
  anchors: Array<[number, number]> = CPI_ANCHOR_PAIRS,
): Record<number, number> {
  const sorted = [...anchors].sort((a, b) => a[0] - b[0]);
  const out: Record<number, number> = {};
  if (sorted.length < 2) return out;

  for (let i = 0; i < sorted.length - 1; i += 1) {
    const [y0, v0] = sorted[i];
    const [y1, v1] = sorted[i + 1];
    for (let y = y0; y <= y1; y += 1) {
      if (y1 === y0) {
        out[y] = v0;
      } else {
        const t = (y - y0) / (y1 - y0);
        out[y] = v0 + t * (v1 - v0);
      }
    }
  }

  return out;
}
