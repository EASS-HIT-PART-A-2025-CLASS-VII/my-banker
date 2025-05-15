const generateReport = require('../services/report/generateReport');

const reportController = async (req, res) => {
    try {
        const { walletAddress, chain } = req.body;

        if (!walletAddress || !chain) {
            return res.status(400).json({ error: 'walletAddress and chain are required' });
        }

        const report = await generateReport(walletAddress, chain);
        res.status(200).json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = reportController;
