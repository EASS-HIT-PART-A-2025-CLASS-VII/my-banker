const reportController = require('../../controllers/reportController');
const generateReport = require('../../services/report/generateReport');

// Mock external dependencies
jest.mock('../../services/report/generateReport');

describe('Report Controller', () => {
    // Setup test utilities
    const mockRequest = (body = {}, user = {}) => ({ body, user });
    const mockResponse = () => ({
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    });

    // Reset mocks
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('reportController', () => {
        it('should generate report successfully', async () => {
            // Prepare mock data
            const mockReport = {
                actions: { totalActions: 2 },
                profitAndLoss: { totalGain: 100 },
                insights: 'Test analysis'
            };

            // Configure mock behavior
            generateReport.mockResolvedValue(mockReport);

            // Prepare request with mock user
            const req = mockRequest({
                walletAddress: '0x123',
                chain: 'ETH'
            }, { username: 'testuser' });

            // Prepare response
            const res = mockResponse();

            // Execute test
            await reportController(req, res);

            // Verify results
            expect(res.json).toHaveBeenCalledWith({
                status: 200,
                data: {
                    type: 'Success',
                    message: mockReport
                }
            });
        });

        it('should handle missing parameters', async () => {
            // Prepare request with missing chain
            const req = mockRequest({
                walletAddress: '0x123'
            }, { username: 'testuser' });  // Adding mock user to avoid error

            // Prepare response
            const res = mockResponse();

            // Execute test
            await reportController(req, res);

            // Verify error handling
            expect(res.json).toHaveBeenCalledWith({
                status: 400,
                error: {
                    type: 'BadRequest',
                    message: 'walletAddress and chain are required'
                }
            });
        });

        it('should handle report generation errors', async () => {
            // Configure mock error
            generateReport.mockRejectedValue(new Error('Failed to fetch data'));

            // Prepare request with mock user
            const req = mockRequest({
                walletAddress: '0x123',
                chain: 'ETH'
            }, { username: 'testuser' });

            // Prepare response
            const res = mockResponse();

            // Execute test
            await reportController(req, res);

            // Verify error handling
            expect(res.json).toHaveBeenCalledWith({
                status: 500,
                error: {
                    type: 'InternalServerError',
                    message: 'Failed to fetch data'
                }
            });
        });
    });
});
