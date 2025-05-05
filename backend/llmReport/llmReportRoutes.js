const express = require('express');
const router = express.Router();
const { analyzeReportWithLLM } = require('./llmReport');

// POST /api/analyze
router.post('/', async (req, res) => {
  const manualReport = req.body;

  try {
    const analysis = await analyzeReportWithLLM(manualReport);
    res.status(200).json({ explanation: analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
