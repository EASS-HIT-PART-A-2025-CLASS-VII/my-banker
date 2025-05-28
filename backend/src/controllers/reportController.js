const generateReport = require('../services/report/generateReport');
const {
    badRequestJsonResponse,
    notFoundJsonResponse,
    unauthorizedJsonResponse,
    internalErrorJsonResponse,
    successJsonResponse,
} = require('../utils/jsonResponses/jsonResponses');

/**
 * @function reportController
 * @description Handles wallet report generation requests
 */
const reportController = async (req, res) => {
    try {
        // Extract request parameters
        const { walletAddress, chain } = req.body;
        const username = req.user.username;

        // Validate required parameters
        if (!walletAddress || !chain) return res.json(badRequestJsonResponse('walletAddress and chain are required'));

        // Generate wallet report
        const report = await generateReport(username, walletAddress, chain);

        // Return success response
        return res.json(successJsonResponse(report));
    } catch (error) {
        // Handle errors
        return res.json(internalErrorJsonResponse(error.message));
    }
};

// Export controller function
module.exports = reportController;