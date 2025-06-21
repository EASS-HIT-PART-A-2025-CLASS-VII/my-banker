const generateActionReport = require('../../../services/report/generateActionReport');

describe('generateActionReport', () => {
  it('should generate correct report for simple transactions', () => {
    const walletInfo = {
      transactions: [
        {
          txid: '1',
          symbol: 'ETH',
          timestamp: '2024-06-01T00:00:00Z',
          type: 'receive',
          amount: 2
        },
        {
          txid: '2',
          symbol: 'ETH',
          timestamp: '2024-06-02T00:00:00Z',
          type: 'send',
          amount: 1
        },
        {
          txid: '3',
          symbol: 'ETH',
          timestamp: '2024-06-03T00:00:00Z',
          type: 'send',
          amount: 1
        },
        {
          txid: '4',
          symbol: 'USDT',
          timestamp: '2024-06-01T00:00:00Z',
          type: 'receive',
          amount: 10
        }
      ]
    };

    const report = generateActionReport(walletInfo);

    expect(report.ETH).toMatchObject({
      calculationMethod: "FIFO",
      totalActions: 3,
      tradingVolume: 4,
      buyActions: 1,
      sellActions: 2,
      firstTransactionDate: '2024-06-01T00:00:00Z',
      lastTransactionDate: '2024-06-03T00:00:00Z',
      avgHoldDurationDays: expect.any(Number),
      longestHoldDays: expect.any(Number),
      shortestHoldDays: expect.any(Number),
      avgTradeSize: 1.33333333,
      maxTradeSize: 2,
      minTradeSize: 1
    });

    expect(report.USDT).toMatchObject({
      calculationMethod: "FIFO",
      totalActions: 1,
      tradingVolume: 10,
      buyActions: 1,
      sellActions: 0,
      firstTransactionDate: '2024-06-01T00:00:00Z',
      lastTransactionDate: '2024-06-01T00:00:00Z',
      avgHoldDurationDays: 0,
      longestHoldDays: 0,
      shortestHoldDays: 0,
      avgTradeSize: 10,
      maxTradeSize: 10,
      minTradeSize: 10
    });
  });

  it('should handle missing symbol as UNKNOWN', () => {
    const walletInfo = {
      transactions: [
        {
          txid: '1',
          timestamp: '2024-06-01T00:00:00Z',
          type: 'receive',
          amount: 5
        }
      ]
    };

    const report = generateActionReport(walletInfo);
    expect(report.UNKNOWN).toBeDefined();
    expect(report.UNKNOWN.totalActions).toBe(1);
    expect(report.UNKNOWN.tradingVolume).toBe(5);
  });

  it('should return empty object for no transactions', () => {
    const walletInfo = { transactions: [] };
    expect(generateActionReport(walletInfo)).toEqual({});
  });
});