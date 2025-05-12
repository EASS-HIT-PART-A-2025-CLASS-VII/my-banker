const { getHistoricalPrice, formatDate } = require('./coinPriceByDateModule');
const generateProfitAndLossReport = require('./profitAndLossReportModule');

// Mock the getHistoricalPrice function
jest.mock('./coinPriceByDateModule', () => ({
    getHistoricalPrice: jest.fn(),
    formatDate: jest.fn(),
}));

describe('generateProfitAndLossReport', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should calculate profit and loss correctly for valid wallet data', async () => {
        // Mock the formatDate function
        formatDate.mockImplementation((timestamp) => '12-05-2025');

        // Mock the getHistoricalPrice function
        getHistoricalPrice.mockResolvedValue(50000);

        // Define wallet data
        const walletInfo = {
            transactions: [
                { timestamp: '2025-05-12T00:00:00Z', type: 'receive', amount: 0.1, fee: 1 },
                { timestamp: '2025-05-12T00:00:00Z', type: 'send', amount: 0.05, fee: 0.5 },
            ],
        };

        // Call the function
        const result = await generateProfitAndLossReport(walletInfo);

        // Expected result
        const expected = {
            bitcoin: {
                Gain: 2500.00, // 0.05 * 50000
                Loss: 5000.00, // 0.1 * 50000
                Fees: 1.50,    // 1 + 0.5
                Sum: -3501.50, // 2500 - 5000 - 1.5
            },
        };

        // Assert the result
        expect(result).toEqual(expected);
    });

    it('should handle empty transactions gracefully', async () => {
        // Define wallet data with no transactions
        const walletInfo = {
            transactions: [],
        };

        // Call the function
        const result = await generateProfitAndLossReport(walletInfo);

        // Expected result
        const expected = {};

        // Assert the result
        expect(result).toEqual(expected);
    });

    it('should handle missing fees in transactions', async () => {
        // Mock the formatDate function
        formatDate.mockImplementation((timestamp) => '12-05-2025');

        // Mock the getHistoricalPrice function
        getHistoricalPrice.mockResolvedValue(50000);

        // Define wallet data with missing fees
        const walletInfo = {
            transactions: [
                { timestamp: '2025-05-12T00:00:00Z', type: 'receive', amount: 0.1 },
                { timestamp: '2025-05-12T00:00:00Z', type: 'send', amount: 0.05 },
            ],
        };

        // Call the function
        const result = await generateProfitAndLossReport(walletInfo);

        // Expected result
        const expected = {
            bitcoin: {
                Gain: 2500.00, // 0.05 * 50000
                Loss: 5000.00, // 0.1 * 50000
                Fees: 0.00,    // No fees provided
                Sum: -2500.00, // 2500 - 5000 - 0
            },
        };

        // Assert the result
        expect(result).toEqual(expected);
    });

    it('should throw an error if getHistoricalPrice fails', async () => {
        // Mock the formatDate function
        formatDate.mockImplementation((timestamp) => '12-05-2025');

        // Mock the getHistoricalPrice function to throw an error
        getHistoricalPrice.mockRejectedValue(new Error('API error'));

        // Define wallet data
        const walletInfo = {
            transactions: [
                { timestamp: '2025-05-12T00:00:00Z', type: 'receive', amount: 0.1, fee: 1 },
            ],
        };

        // Call the function and assert it throws an error
        await expect(generateProfitAndLossReport(walletInfo)).rejects.toThrow('API error');
    });
});