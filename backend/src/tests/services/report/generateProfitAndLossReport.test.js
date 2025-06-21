const generateProfitAndLossReport = require('../../../services/report/generateProfitAndLossReport');

describe('generateProfitAndLossReport', () => {
  it('calculates profit, loss, fees, and return percent for each token', async () => {
    const walletInfo = {
      transactions: [
        {
          symbol: 'ETH',
          timestamp: '2024-06-01T00:00:00Z',
          type: 'receive',
          amount: 2,
          fee: 0.01
        },
        {
          symbol: 'ETH',
          timestamp: '2024-06-02T00:00:00Z',
          type: 'send',
          amount: 1,
          fee: 0.02
        },
        {
          symbol: 'ETH',
          timestamp: '2024-06-03T00:00:00Z',
          type: 'send',
          amount: 1,
          fee: 0.03
        },
        {
          symbol: 'USDT',
          timestamp: '2024-06-01T00:00:00Z',
          type: 'receive',
          amount: 10,
          fee: 0
        },
        {
          symbol: 'USDT',
          timestamp: '2024-06-04T00:00:00Z',
          type: 'send',
          amount: 5,
          fee: 0.5
        }
      ]
    };

    const report = await generateProfitAndLossReport(walletInfo);

    expect(report.ETH).toEqual({
      gains: 2.00, 
      losses: 0.06, 
      fees: 0.06,
      startDate: '2024-06-01T00:00:00Z',
      endDate: '2024-06-03T00:00:00Z',
      returnPercent: '0 %'
    });

    expect(report.USDT).toEqual({
      gains: 5.00, 
      losses: 5.5, 
      fees: 0.5,
      startDate: '2024-06-01T00:00:00Z',
      endDate: '2024-06-04T00:00:00Z',
      returnPercent: '50 %'
    });
  });

  it('handles missing symbol as UNKNOWN', async () => {
    const walletInfo = {
      transactions: [
        {
          timestamp: '2024-06-01T00:00:00Z',
          type: 'receive',
          amount: 3,
          fee: 0.1
        }
      ]
    };
    const report = await generateProfitAndLossReport(walletInfo);
    expect(report.UNKNOWN).toBeDefined();
    expect(report.UNKNOWN.gains).toBe(0);
    expect(report.UNKNOWN.losses).toBe(3.1);
    expect(report.UNKNOWN.fees).toBe(0.1);
    expect(report.UNKNOWN.returnPercent).toBe('100 %');
  });

  it('returns empty object for no transactions', async () => {
    const walletInfo = { transactions: [] };
    const report = await generateProfitAndLossReport(walletInfo);
    expect(report).toEqual({});
  });
});