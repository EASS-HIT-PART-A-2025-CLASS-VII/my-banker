// Import required modules
const generateProfitAndLossReport = require('../../../services/report/generateProfitAndLossReport');
const { getHistoricalPrice, formatDate } = require('../../../externals/abstractLayersForAPI/getCoinPriceByDate');

// Mock the external API functions
jest.mock('../../../externals/abstractLayersForAPI/getCoinPriceByDate');

describe('Generate Profit and Loss Report', () => {
    // Setup test environment before each test
    beforeEach(() => {
        jest.clearAllMocks();
        formatDate.mockImplementation(date => '01-01-2025');
        getHistoricalPrice.mockResolvedValue(50000); // Mock BTC price at $50,000
    });

    // Test successful report generation with both buy and sell transactions
    it('should calculate profit and loss correctly for mixed transactions', async () => {
        // Mock wallet data with buy and sell transactions
        const walletInfo = {
            transactions: [
                { timestamp: '2025-01-01T00:00:00Z', type: 'receive', amount: 1.0, fee: 0.1 },
                { timestamp: '2025-01-01T00:00:00Z', type: 'send', amount: 0.5, fee: 0.05 }
            ]
        };

        // Execute report generation
        const result = await generateProfitAndLossReport(walletInfo);

        // Verify the results
        expect(result).toEqual({
            Gain: 25000.00,  // 0.5 BTC * $50,000
            Loss: 50000.00,  // 1.0 BTC * $50,000
            Fees: 0.15,      // 0.1 + 0.05
            Sum: -25000.15   // 25000 - 50000 - 0.15
        });
    });

    // Test report generation with only purchase transactions
    it('should handle only purchase transactions', async () => {
        // Mock wallet data with only purchases
        const walletInfo = {
            transactions: [
                { timestamp: '2025-01-01T00:00:00Z', type: 'receive', amount: 1.0, fee: 0.1 }
            ]
        };

        // Execute report generation
        const result = await generateProfitAndLossReport(walletInfo);

        // Verify the results
        expect(result).toEqual({
            Gain: 0.00,      // No sales
            Loss: 50000.00,  // 1.0 BTC * $50,000
            Fees: 0.10,
            Sum: -50000.10   // 0 - 50000 - 0.1
        });
    });

    // Test report generation with only sale transactions
    it('should handle only sale transactions', async () => {
        // Mock wallet data with only sales
        const walletInfo = {
            transactions: [
                { timestamp: '2025-01-01T00:00:00Z', type: 'send', amount: 1.0, fee: 0.1 }
            ]
        };

        // Execute report generation
        const result = await generateProfitAndLossReport(walletInfo);

        // Verify the results
        expect(result).toEqual({
            Gain: 50000.00,  // 1.0 BTC * $50,000
            Loss: 0.00,      // No purchases
            Fees: 0.10,
            Sum: 49999.90    // 50000 - 0 - 0.1
        });
    });

    // Test error handling for API failures
    it('should handle API errors gracefully', async () => {
        // Mock API error
        getHistoricalPrice.mockRejectedValue(new Error('API Error'));

        // Mock wallet data
        const walletInfo = {
            transactions: [
                { timestamp: '2025-01-01T00:00:00Z', type: 'receive', amount: 1.0, fee: 0.1 }
            ]
        };

        // Execute and verify error handling
        await expect(generateProfitAndLossReport(walletInfo))
            .rejects
            .toThrow('API Error');
    });

    // Test handling of empty transaction list
    it('should handle empty transaction list', async () => {
        // Mock wallet data with no transactions
        const walletInfo = {
            transactions: []
        };

        // Execute report generation
        const result = await generateProfitAndLossReport(walletInfo);

        // Verify the results
        expect(result).toEqual({
            Gain: 0.00,
            Loss: 0.00,
            Fees: 0.00,
            Sum: 0.00
        });
    });
});