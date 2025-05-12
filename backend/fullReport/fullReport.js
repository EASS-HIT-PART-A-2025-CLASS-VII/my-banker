const express = require('express');
const router = express.Router();
const analyzeReportWithLLM = require('../llmReport/llmReport');
const getWalletInformation = require('../walletInformation/walletInformation');
const getManualReport = require('../manualReports/manualReports');

router.post('/', async (req, res) => {
  try {

    const walletAddress = req.body.publicKey;
    const coinType = req.body.coin;

    const walletInfo = await getWalletInformation(walletAddress, coinType);
    const manualReport = await getManualReport(walletInfo);
    const analysis = await analyzeReportWithLLM(manualReport);


    // Combine all reports into a single object
    const fullReport = {
      manual_report: manualReport,
      analysis: analysis,
    };

    // Send the full report as a JSON response
    res.status(200).json(fullReport);
  } catch (error) {

    // Send a 500 Internal Server Error response
    res.status(500).json(internalErrorJsonResponse('Internal server error while generating report'));
  }
});

// Export the router to be used in other parts of the application
module.exports = router;