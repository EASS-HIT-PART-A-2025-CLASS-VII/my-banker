const generateProfitAndLossReport = require('../../../services/report/generateProfitAndLossReport');
const { getHistoricalPrice, formatDate } = require('../../../externals/abstractLayersForAPI/getCoinPriceByDate');

jest.mock('../../../externals/abstractLayersForAPI/getCoinPriceByDate');

describe('Generate Profit and Loss Report', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        formatDate.mockImplementation(date => '01-01-2025');
        getHistoricalPrice.mockResolvedValue(50000);
    });

    it('should calculate profit and loss correctly for mixed transactions', async () => {
        const walletInfo = {
            transactions: [
                { timestamp: '2025-01-01T00:00:00Z', type: 'receive', amount: 1.0, fee: 0.1 },
                { timestamp: '2025-01-01T00:00:00Z', type: 'send', amount: 0.5, fee: 0.05 }
            ]
        };
        const result = await generateProfitAndLossReport(walletInfo);

        expect(result).toEqual({
            Gain: 25000.00,
            Loss: 50000.00,
            Fees: 0.15, 
            Sum: -25000.15 
        });
    });

    it('should handle only purchase transactions', async () => {
        const walletInfo = {
            transactions: [
                { timestamp: '2025-01-01T00:00:00Z', type: 'receive', amount: 1.0, fee: 0.1 }
            ]
        };

        const result = await generateProfitAndLossReport(walletInfo);

        expect(result).toEqual({
            Gain: 0.00, 
            Loss: 50000.00,
            Fees: 0.10,
            Sum: -50000.10 
        });
    });

    it('should handle only sale transactions', async () => {
        const walletInfo = {
            transactions: [
                { timestamp: '2025-01-01T00:00:00Z', type: 'send', amount: 1.0, fee: 0.1 }
            ]
        };
        const result = await generateProfitAndLossReport(walletInfo);

        expect(result).toEqual({
            Gain: 50000.00,
            Loss: 0.00,    
            Fees: 0.10,
            Sum: 49999.90   
        });
    });

    it('should handle API errors gracefully', async () => {
        getHistoricalPrice.mockRejectedValue(new Error('API Error'));

        const walletInfo = {
            transactions: [
                { timestamp: '2025-01-01T00:00:00Z', type: 'receive', amount: 1.0, fee: 0.1 }
            ]
        };

        await expect(generateProfitAndLossReport(walletInfo))
            .rejects
            .toThrow('API Error');
    });

    it('should handle empty transaction list', async () => {
        const walletInfo = {
            transactions: []
        };

        const result = await generateProfitAndLossReport(walletInfo);

        expect(result).toEqual({
            Gain: 0.00,
            Loss: 0.00,
            Fees: 0.00,
            Sum: 0.00
        });
    });
});