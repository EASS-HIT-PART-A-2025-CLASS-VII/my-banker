const generateActionReport = require('../../backend/manualReports/manualReportsModules/actionReportModule');

describe('generateActionReport', () => {
  it('should generate a correct action report for valid wallet data', () => {
    // Mock wallet data
    const walletInfo = {
      wallet: [
        {
          coin: 'BTC',
          balance: 1.5,
          transactions: [
            { amount: 0.5, fee: 0.01 },
            { amount: 1.0, fee: 0.02 },
          ],
        },
        {
          coin: 'ETH',
          balance: 10,
          transactions: [
            { amount: 5, fee: 0.1 },
            { amount: 5, fee: 0.15 },
          ],
        },
      ],
    };

    // Expected result
    const expectedResult = [
      {
        coin: 'BTC',
        calculationMethod: 'FIFO',
        totalActions: 2,
        tradingVolume: 1.5,
        totalCommissionPaid: 0.03,
      },
      {
        coin: 'ETH',
        calculationMethod: 'FIFO',
        totalActions: 2,
        tradingVolume: 10,
        totalCommissionPaid: 0.25,
      },
    ];

    // Call the function
    const result = generateActionReport(walletInfo);

    // Assert the result matches the expected output
    expect(result).toEqual(expectedResult);
  });

  it('should return an empty array for an empty wallet', () => {
    // Mock wallet data with an empty wallet
    const walletInfo = { wallet: [] };

    // Expected result
    const expectedResult = [];

    // Call the function
    const result = generateActionReport(walletInfo);

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
    const expectedResult = [
      {
        coin: 'BTC',
        calculationMethod: 'FIFO',
        totalActions: 0,
        tradingVolume: 0,
        totalCommissionPaid: 0,
      },
    ];

    // Call the function
    const result = generateActionReport(walletInfo);

    // Assert the result matches the expected output
    expect(result).toEqual(expectedResult);
  });

  it('should handle missing wallet property gracefully', () => {
    // Mock wallet data with no wallet property
    const walletInfo = {};

    // Call the function and expect an error
    expect(() => generateActionReport(walletInfo)).toThrow(
      new TypeError("Cannot read property 'map' of undefined")
    );
  });
});