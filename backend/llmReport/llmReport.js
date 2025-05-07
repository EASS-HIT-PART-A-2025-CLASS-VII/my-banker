const http = require('http');

function analyzeReportWithLLM(manualReport) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'mistral', // or your preferred model
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

        ---

        Below is an example of a good answer format for inspiration:

        Dear Client,

        **Profit & Loss Overview:**  
        Your cryptocurrency portfolio has shown healthy performance across multiple assets. Bitcoin activity included a total of 0.5 BTC received and 0.2 BTC sent, resulting in a net profit of 0.3 BTC. Ethereum showed strong gains, with 5.5 ETH received and only 1.25 ETH sent, yielding a notable profit of 4.25 ETH. Solana demonstrated high transactional volume with 80.25 SOL received and 20.5 SOL sent, generating a solid profit of 59.75 SOL.

        **Current Balances:**  
        You currently hold 1.2345 BTC, 10.5678 ETH, and 150.75 SOL. These balances indicate a well-diversified crypto portfolio, with significant holdings in both major and emerging assets.

        **Actions and Trading Behavior:**  
        You executed 2 Bitcoin transactions totaling 0.7 BTC in volume, with a total commission of 0.00018 BTC. Ethereum saw 3 actions with 6.75 ETH volume and 0.0059 ETH in fees. Solana transactions were the most frequent, with 3 actions and a high trading volume of 100.75 SOL, incurring minimal commissions of 0.00012 SOL. This suggests active management with an emphasis on low-fee, high-volume strategies.

        **Summary & Recommendation:**  
        Overall, your portfolio is performing strongly, with positive profit margins across all assets and efficient transaction behavior. You maintain healthy balances and have demonstrated smart allocation and timing. To further enhance portfolio resilience, consider periodic rebalancing and monitoring market shifts, especially in emerging assets like Solana.

        Warm regards,  
        Your Private Banker

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
