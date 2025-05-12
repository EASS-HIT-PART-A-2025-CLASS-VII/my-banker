const http = require('http');

function analyzeReportWithLLM(manualReport) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'tinyllama', // or your preferred model
      prompt: `
        You are a private banker and financial analyst. Use only the data provided below:

        ${JSON.stringify(manualReport, null, 2)}

        Write a single, well-written paragraph, in fluent, formal English, summarizing this client's portfolio and activity.

        Use all the numbers and facts from the data above.

        Do not use any headings, bullet points, brackets, or placeholders.

        Do not invent or add any information that is not in the data.

        The paragraph should sound like a private banker writing to a high-net-worth client.

        Do not repeat the same fact.

        Do not use phrases like "Dear Client" or "Kind regards".

        Example of the style you should use:

        Your Bitcoin portfolio has realized total gains of 498.38 BTC and total losses of 498.38 BTC, resulting in a net result of zero with no fees incurred. You currently have no active Bitcoin holdings, as your balance stands at 0 BTC, and transactions were accounted for using the FIFO method, indicating all prior positions have been closed. Over the reporting period, you executed two Bitcoin transactions with a combined trading volume of 0.00968074 BTC, paying no commissions, which demonstrates efficient cost management. Given these results, your recent activity reflects a neutral outcome and an inactive portfolio, suggesting this may be an opportune moment to review your investment strategy or consider re-entering the market when conditions align with your objectives.
          
      `,
      stream: false
    });

    const options = {
      hostname: 'ollama', // use 'ollama' as the hostname in Docker Compose
      port: 11434,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed.response.trim());
        } catch (err) {
          reject(new Error('Failed to parse response from Ollama: ' + err.message));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error('Request to Ollama failed: ' + err.message));
    });

    req.write(data);
    req.end();
  });
}

module.exports = { analyzeReportWithLLM };
