const generateBalancesReport = require('../../backend/manualReports/manualReportsModules/balancesReportModule');

describe('generateBalancesReport', () => {
  it('should generate correct balances for valid wallet data', () => {
    // Mock wallet data
    const walletInfo = {
      wallet: [
        { coin: 'BTC', balance: 1.5, transactions: [] },
        { coin: 'ETH', balance: 10, transactions: [] },
      ],
    };

    // Expected result
    const expectedResult = {
      BTC: 1.5,
      ETH: 10,
    };

    // Call the function
    const result = generateBalancesReport(walletInfo);

    // Assert the result matches the expected output
    expect(result).toEqual(expectedResult);
  });

  it('should return an empty object for an empty wallet', () => {
    // Mock wallet data with an empty wallet
    const walletInfo = { wallet: [] };

    // Expected result
    const expectedResult = {};

    // Call the function
    const result = generateBalancesReport(walletInfo);

    // Assert the result matches the expected output
    expect(result).toEqual(expectedResult);
  });

  it('should handle missing wallet property gracefully', () => {
    // Mock wallet data with no wallet property
    const walletInfo = {};

    // Call the function and expect an error
    expect(() => generateBalancesReport(walletInfo)).toThrow(
      new TypeError("Cannot read property 'forEach' of undefined")
    );
  });

  it('should handle coins with zero balance', () => {
    // Mock wallet data with coins having zero balance
    const walletInfo = {
      wallet: [
        { coin: 'BTC', balance: 0, transactions: [] },
        { coin: 'ETH', balance: 0, transactions: [] },
      ],
    };

    // Expected result
    const expectedResult = {
      BTC: 0,
      ETH: 0,
    };

    // Call the function
    const result = generateBalancesReport(walletInfo);

    // Assert the result matches the expected output
    expect(result).toEqual(expectedResult);
  });
});