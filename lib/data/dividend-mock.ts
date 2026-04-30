/**
 * Mock dividend presets for UI hints (no outbound API calls in MVP).
 */

export type MockDividendPreset = {
  symbol: string;
  name: string;
  indicativeYieldPct: number;
};

export const MOCK_DIVIDEND_PRESETS: MockDividendPreset[] = [
  { symbol: "SCHD", name: "US Dividend Equity (ETF)", indicativeYieldPct: 0.035 },
  { symbol: "VYM", name: "High Dividend Yield (ETF)", indicativeYieldPct: 0.03 },
  {
    symbol: "JEPI",
    name: "Equity Premium Income (ETF)",
    indicativeYieldPct: 0.065,
  },
  { symbol: "VIG", name: "Dividend Appreciation (ETF)", indicativeYieldPct: 0.018 },
  { symbol: "SPY", name: "S&P 500 (ETF)", indicativeYieldPct: 0.012 },
];
