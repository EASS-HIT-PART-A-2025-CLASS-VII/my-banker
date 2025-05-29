const axios = require('axios');
const { getHistoricalPrice, formatDate } = require('../../externals/abstractLayersForAPI/getCoinPriceByDate');

jest.mock('axios');

describe('Coin Price Utilities', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getHistoricalPrice', () => {
        it('should return USD price when data is available', async () => {
            axios.get.mockResolvedValue({
                data: {
                    market_data: {
                        current_price: {
                            usd: 50000
                        }
                    }
                }
            });

            const price = await getHistoricalPrice('bitcoin', '01-01-2023');
            expect(price).toBe(50000);
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('bitcoin/history?date=01-01-2023')
            );
        });

        it('should return null when price data is missing', async () => {
            axios.get.mockResolvedValue({
                data: {}
            });

            const price = await getHistoricalPrice('bitcoin', '01-01-2023');
            expect(price).toBeNull();
        });

        it('should throw error when symbol is missing', async () => {
            await expect(getHistoricalPrice(null, '01-01-2023'))
                .rejects
                .toThrow('Symbol is required');
        });

        it('should handle API errors', async () => {
            axios.get.mockRejectedValue(new Error('API Error'));

            await expect(getHistoricalPrice('bitcoin', '01-01-2023'))
                .rejects
                .toThrow('Failed to fetch historical price');
        });
    });

    describe('formatDate', () => {
        it('should format ISO date string correctly', () => {
            const testCases = [
                {
                    input: '2023-01-15T12:00:00Z',
                    expected: '15-01-2023'
                },
                {
                    input: '2023-12-05T00:00:00Z',
                    expected: '05-12-2023'
                },
                {
                    input: '2024-02-29T15:30:00Z',
                    expected: '29-02-2024'
                }
            ];

            testCases.forEach(({ input, expected }) => {
                expect(formatDate(input)).toBe(expected);
            });
        });

        it('should handle single digit days and months', () => {
            const result = formatDate('2023-07-05T00:00:00Z');
            expect(result).toBe('05-07-2023');
        });

        it('should handle different time zones', () => {
            const date = new Date(Date.UTC(2023, 11, 31, 23, 0, 0)); 
            const result = formatDate(date.toISOString());
            expect(result).toBe('31-12-2023');
        });
    });
});