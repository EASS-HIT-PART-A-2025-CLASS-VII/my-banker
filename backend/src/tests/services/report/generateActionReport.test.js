// Import the function to test
const generateActionReport = require('../../../services/report/generateActionReport');

describe('Generate Action Report', () => {
    // Test case for empty transactions array
    it('should handle empty transactions array', () => {
        // Mock wallet info with no transactions
        const walletInfo = {
            coin: 'BTC',
            transactions: []
        };

        // Execute report generation
        const result = generateActionReport(walletInfo);

        // Verify the results
        expect(result).toEqual({
            coin: 'BTC',
            calculationMethod: 'FIFO',
            totalActions: 0,
            tradingVolume: 0,
            totalCommissionPaid: 0
        });
    });

    // Test case for transactions with fees
    it('should calculate correct totals for transactions with fees', () => {
        // Mock wallet info with transactions including fees
        const walletInfo = {
            coin: 'ETH',
            transactions: [
                { amount: 1.5, fee: 0.1 },
                { amount: 2.5, fee: 0.2 }
            ]
        };

        // Execute report generation
        const result = generateActionReport(walletInfo);

        // Verify the results
        expect(result).toEqual({
            coin: 'ETH',
            calculationMethod: 'FIFO',
            totalActions: 2,
            tradingVolume: 4,
            totalCommissionPaid: 0.30000000000000004
        });
    });

    // Test case for transactions without fees
    it('should handle transactions without fees', () => {
        // Mock wallet info with transactions without fees
        const walletInfo = {
            coin: 'ETH',
            transactions: [
                { amount: 100 },
                { amount: 200 }
            ]
        };

        // Execute report generation
        const result = generateActionReport(walletInfo);

        // Verify the results
        expect(result).toEqual({
            coin: 'ETH',
            calculationMethod: 'FIFO',
            totalActions: 2,
            tradingVolume: 300,
            totalCommissionPaid: 0
        });
    });

    // Test case for mixed transactions (with and without fees)
    it('should handle mixed transactions with and without fees', () => {
        // Mock wallet info with mixed transactions
        const walletInfo = {
            coin: 'LTC',
            transactions: [
                { amount: 1.0, fee: 0.1 },
                { amount: 2.0 },
                { amount: 3.0, fee: 0.2 }
            ]
        };

        // Execute report generation
        const result = generateActionReport(walletInfo);

        // Verify the results
        expect(result).toEqual({
            coin: 'LTC',
            calculationMethod: 'FIFO',
            totalActions: 3,
            tradingVolume: 6.0,
            totalCommissionPaid: 0.30000000000000004
        });
    });
});