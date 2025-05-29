const generateActionReport = require('../../../services/report/generateActionReport');

describe('Generate Action Report', () => {
    it('should handle empty transactions array', () => {
        const walletInfo = {
            coin: 'BTC',
            transactions: []
        };
        const result = generateActionReport(walletInfo);

        expect(result).toEqual({
            coin: 'BTC',
            calculationMethod: 'FIFO',
            totalActions: 0,
            tradingVolume: 0,
            totalCommissionPaid: 0
        });
    });

    it('should calculate correct totals for transactions with fees', () => {
        const walletInfo = {
            coin: 'ETH',
            transactions: [
                { amount: 1.5, fee: 0.1 },
                { amount: 2.5, fee: 0.2 }
            ]
        };
        const result = generateActionReport(walletInfo);

        expect(result).toEqual({
            coin: 'ETH',
            calculationMethod: 'FIFO',
            totalActions: 2,
            tradingVolume: 4,
            totalCommissionPaid: 0.30000000000000004
        });
    });

    it('should handle transactions without fees', () => {
        const walletInfo = {
            coin: 'ETH',
            transactions: [
                { amount: 100 },
                { amount: 200 }
            ]
        };
        const result = generateActionReport(walletInfo);

        expect(result).toEqual({
            coin: 'ETH',
            calculationMethod: 'FIFO',
            totalActions: 2,
            tradingVolume: 300,
            totalCommissionPaid: 0
        });
    });

    it('should handle mixed transactions with and without fees', () => {
        const walletInfo = {
            coin: 'LTC',
            transactions: [
                { amount: 1.0, fee: 0.1 },
                { amount: 2.0 },
                { amount: 3.0, fee: 0.2 }
            ]
        };
        const result = generateActionReport(walletInfo);

        expect(result).toEqual({
            coin: 'LTC',
            calculationMethod: 'FIFO',
            totalActions: 3,
            tradingVolume: 6.0,
            totalCommissionPaid: 0.30000000000000004
        });
    });
});