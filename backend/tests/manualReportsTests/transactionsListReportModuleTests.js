const generateTransactionsListReport = require('../../manualReports/manualReportsModules/transactionsListReportModule');

describe('generateTransactionsListReport', () => {
  it('should generate a flat list of all transactions for valid wallet data', () => {
    // Mock wallet data
    const walletInfo = {
      wallet: [
        {
          coin: 'BTC',
          balance: 1.5,
          transactions: [
            { type: 'receive', amount: 1.0, timestamp: '2023-01-01T00:00:00Z' },
            { type: 'send', amount: 0.5, timestamp: '2023-01-02T00:00:00Z' },
          ],
        },
        {
          coin: 'ETH',
          balance: 10,
          transactions: [
            { type: 'receive', amount: 5, timestamp: '2023-01-03T00:00:00Z' },
            { type: 'send', amount: 2, timestamp: '2023-01-04T00:00:00Z' },
          ],
        },
      ],
    };

    // Expected result
    const expectedResult = [
      { coin: 'BTC', type: 'receive', amount: 1.0, timestamp: '2023-01-01T00:00:00Z' },
      { coin: 'BTC', type: 'send', amount: 0.5, timestamp: '2023-01-02T00:00:00Z' },
      { coin: 'ETH', type: 'receive', amount: 5, timestamp: '2023-01-03T00:00:00Z' },
      { coin: 'ETH', type: 'send', amount: 2, timestamp: '2023-01-04T00:00:00Z' },
    ];

    // Call the function
    const result = generateTransactionsListReport(walletInfo);

    // Assert the result matches the expected output
    expect(result).toEqual(expectedResult);
  });

  it('should return an empty array for an empty wallet', () => {
    // Mock wallet data with an empty wallet
    const walletInfo = { wallet: [] };

    // Expected result
    const expectedResult = [];

    // Call the function
    const result = generateTransactionsListReport(walletInfo);

    // Assert the result matches the expected output
    expect(result).toEqual(expectedResult);
  });

  it('should handle coins with no transactions', () => {
    // Mock wallet data with a coin that has no transactions
    const walletInfo = {
      wallet: [
        {
          coin: 'BTC',
          balance: 1.5,
          transactions: [],
        },
      ],
    };

    // Expected result
    const expectedResult = [];

    // Call the function
    const result = generateTransactionsListReport(walletInfo);

    // Assert the result matches the expected output
    expect(result).toEqual(expectedResult);
  });

  it('should handle missing wallet property gracefully', () => {
    // Mock wallet data with no wallet property
    const walletInfo = {};

    // Call the function and expect an error
    expect(() => generateTransactionsListReport(walletInfo)).toThrow(
      new TypeError("Cannot read property 'forEach' of undefined")
    );
  });
});