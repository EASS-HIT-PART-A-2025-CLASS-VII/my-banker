const axios = require('axios');

async function generateLlmAnalysis(actionReport, pnlReport, userPreferences) {
    const payload = {
        model: 'gemma3:1b',
        prompt: `
        You are a crypto tax advisor and investment analyst.

You will need to analyze transaction data provided in JSON format from a user's crypto trading account.

Your response should be based **strictly on the data given**. Provide **short and focused insights**, with a maximum of three insights per section.

Requirements:
- Do **not provide general advice** or assumptions. Do **not make estimates** or share opinions not supported by the data.
- Answer **only** based on the provided JSON data.
- Focus your insights strictly on tax and investment-related topics.

Break your answer into two sections:
---

**Tax Insights**
- Provide **3 short, concise insights** focused on realized gains/losses, fees, holding period, taxable events, etc.
- Use terms like: "realized loss", "offset future gains", "deductible fees", "short holding period", "FIFO", etc.
- **Do not make assumptions**; answer strictly according to the given data.

---

**Investment Advice**
- Provide **3 short, concise insights** related to trading strategy, trade frequency, loss-to-gain ratio, holding duration, etc.
- Use terms like: "trading strategy", "trade frequency", "net profitability after fees", "short-term strategy", "timing-based trades", etc.
- **Do not make assumptions**; answer strictly according to the given data.

---

Here is an example of the JSON format you might receive:

{
  "coin": "BTC",
  "balance": 0,
  "transactions": [
    {
      "txid": "69ff35cf71a8c2858670ccb42a3e137ac77836257e71eb0ffc2ce9a05df409e6",
      "timestamp": "2025-05-10T16:50:53.000Z",
      "type": "send",
      "fee": 0,
      "amount": 0.00484037
    },
    {
      "txid": "089b2e5e885a5377c01353dd9926c1111c21c59242c22fbb67e42c5684b70682",
      "timestamp": "2025-05-10T16:14:38.000Z",
      "type": "receive",
      "fee": 0,
      "amount": 0.00484037
    }
  ]
}

---

### Example Output:

**Tax Insights**
- No realized gains or losses — amounts sent and received are equal.
- No fees recorded — no deductible fees to report.
- Holding period is 0 days — treated as short-term for tax purposes under FIFO.

**Investment Advice**
- High frequency of trades with no accumulated fees — costs could erode profitability.
- Short holding periods suggest a strategy based on quick gains.
- No clear loss-to-gain ratio, as both transactions are neutral in value.

        ---

        Now analyze this data:


        ${JSON.stringify(actionReport, null, 2)}

        ${JSON.stringify(pnlReport, null, 2)}

        User preferences for analysis:

        ${JSON.stringify(userPreferences, null, 2)}
        `,
        stream: false
    };

    try {
        const response = await axios.post('http://ollama:11434/api/generate', payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data.response.trim();
    } catch (error) {
        throw new Error('Request to Ollama failed: ' + error.message);
    }
}

module.exports = generateLlmAnalysis;