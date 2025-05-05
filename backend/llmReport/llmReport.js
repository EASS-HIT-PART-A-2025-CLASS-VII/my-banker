const http = require('http');

function analyzeReportWithLLM(manualReport) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'tinyllama', // or your preferred model
      prompt: `
        You are a private banker and financial analyst. I will provide you with a structured JSON financial report containing cryptocurrency data across several coins (Bitcoin, Ethereum, and Solana). 

        Your job is to write a professional and concise financial summary **as if written for a high-net-worth individual client**. The report should be:

        1. Written in fluent English with natural flow
        2. Structured in paragraphs with logical transitions
        3. Include the actual numbers from the report (e.g., profit/loss, balances, volumes)
        4. Provide insights into portfolio health, transaction behavior, and potential risks

        Use the following structure:

        - **Profit & Loss Overview**: Mention each coin with received/sent amounts and profit/loss.
        - **Current Balances**: List balances and what they may indicate about the portfolio.
        - **Actions and Trading Behavior**: Highlight total actions, volume, commissions paid.
        - **Summary & Recommendation**: Short conclusion about financial behavior and possible advice.

        Here is the report:

        ${JSON.stringify(manualReport, null, 2)}
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
