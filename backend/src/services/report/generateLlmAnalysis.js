const axios = require('axios');

async function generateLlmAnalysis(actionReport, pnlReport, userPreferences) {
    const payload = {
        model: 'gemma3:4b',
        prompt: `You are a crypto tax advisor and investment analyst. Analyze the provided trading data and give ONE consolidated response with exactly 3 tax insights and 3 investment insights.

        IMPORTANT RULES:
        - Provide ONLY ONE response, not multiple sections
        - Base analysis STRICTLY on the provided data
        - Do NOT repeat information
        - Be concise and specific
        - Use exact numbers from the data

        DATA TO ANALYZE:
        ${JSON.stringify(actionReport, null, 2)}
        ${JSON.stringify(pnlReport, null, 2)}

        Use only the exact numbers provided. Do not calculate ratios or make mathematical interpretations.

        User Preferences: ${JSON.stringify(userPreferences, null, 2)}

        REQUIRED FORMAT (respond with exactly this structure):

        **Tax Insights**
        [One specific tax insight based on the data]
        [One specific tax insight based on the data]  
        [One specific tax insight based on the data]

        **Investment Advice**
        [One specific investment insight based on the data]
        [One specific investment insight based on the data]
        [One specific investment insight based on the data]

        STOP after providing exactly 6 numbered insights total.`,
        stream: false,
        options: {
            temperature: 0.3, 
            top_p: 0.8, 
            repeat_penalty: 1.2
        }
    };

    try {
        const response = await axios.post('http://ollama:11434/api/generate', payload, {
            headers: {
                'Content-Type': 'application/json'
            },
        });

        let result = response.data.response.trim();
        
        result = removeDuplicateSections(result);
        
        return result;
    } catch (error) {
        throw new Error('Request to Ollama failed: ' + error.message);
    }
}

function removeDuplicateSections(text) {
    const sections = text.split('**Tax Insights**');
    
    if (sections.length > 2) {
        const firstPart = sections[0];
        const taxSection = sections[1].split('**Investment Advice**')[0];
        const investmentSection = sections[1].split('**Investment Advice**')[1];
        
        if (investmentSection) {
            const cleanInvestmentSection = investmentSection.split('**Tax Insights**')[0];
            return `${firstPart}**Tax Insights**${taxSection}**Investment Advice**${cleanInvestmentSection}`.trim();
        }
    }
    
    return text;
}

module.exports = generateLlmAnalysis;