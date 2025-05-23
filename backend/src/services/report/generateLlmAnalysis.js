const axios = require('axios');

/**
 * @function generateLlmAnalysis
 * @description Generates AI-powered analysis of financial reports using LLM
 */
async function generateLlmAnalysis(walletInsightsInput) {
    // Configure LLM request
    const payload = {
        model: 'llama3.2:3b',
        prompt: `
            You are a private banker and financial analyst. Use only the data provided below:

            ${JSON.stringify(walletInsightsInput, null, 2)}

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
    };

    try {
        // Send request to Ollama API
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