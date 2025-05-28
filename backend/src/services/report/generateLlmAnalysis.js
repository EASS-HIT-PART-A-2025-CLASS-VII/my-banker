const axios = require('axios');

/**
 * @function generateLlmAnalysis
 * @description Generates AI-powered analysis of financial reports using LLM
 */
async function generateLlmAnalysis(walletInsightsInput, userPreferences) {
    // Configure LLM request
    const payload = {
        model: 'mistral',
        prompt: `
            As a senior private banker at a global wealth management firm, analyze the client's portfolio exclusively using the provided JSON data. Compose a single polished paragraph for ultra-high-net-worth clients that integrates tax efficiency analysis with portfolio performance. 
            Use the JSON object included under ${JSON.stringify(walletInsightsInput, null, 2)} as your exclusive data source. This data represents a comprehensive snapshot of the client’s investment portfolio and activity during a specific reporting period. You must extract, reference, and incorporate all numerical values and relevant facts from this data without altering, omitting, or reinterpreting any figures.
            Additionally, use the data found under ${JSON.stringify(userPreferences, null, 2)} to consider the user preferences and tailor the response accordingly.
            Mandatory inclusions:
            - Realized capital gains/losses with tax liability calculations
            - Tax-advantaged vs taxable asset allocation percentages
            - Tax-loss harvesting opportunities from closed positions
            - Dividend/coupon tax treatment across jurisdictions
            - Carryforward losses and tax deferral strategies
            - Fee structures impacting net tax-equivalent returns

            Use precise terminology: 
            Tax alpha, basis points drag, tax lot accounting, wash sale implications, AMT exposure, step-up basis opportunities.

            Example structure (adapt to data):
            "The portfolio generated $2.1M realized gains (15% LTCG rate) offset by $750k harvested losses, yielding net taxable income of $1.35M. Fixed income allocations (40% munis vs 60% corporates) reduced ordinary income tax exposure by 22%. Three closed equity positions present $385k carryforward losses. International holdings' $420k dividends qualify for 15% treaty rates versus 23.8% domestic rate. 0.45% management fees equate to 68bps post-tax drag at marginal rates. Current FIFO accounting suggests basis optimization through specific lot identification could defer $210k in gains."

            Output ONLY the formal paragraph using exact JSON figures without disclaimers.

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