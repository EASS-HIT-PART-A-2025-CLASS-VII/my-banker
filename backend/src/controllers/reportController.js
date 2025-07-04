const generateReport = require('../services/report/generateReport');
const {
    badRequestJsonResponse,
    internalErrorJsonResponse,
    successJsonResponse,
} = require('../utils/jsonResponses/jsonResponses');

const reportController = async (req, res) => {
    try {
        const { walletAddress, chain } = req.body;
        const username = req.user.username;

        if (!walletAddress || !chain) return res.json(badRequestJsonResponse('walletAddress and chain are required'));

        const report = await generateReport(username, walletAddress, chain);

        return res.json(successJsonResponse(report));
    } catch (error) {
        return res.json(internalErrorJsonResponse(error.message));
    }
};

module.exports = reportController;