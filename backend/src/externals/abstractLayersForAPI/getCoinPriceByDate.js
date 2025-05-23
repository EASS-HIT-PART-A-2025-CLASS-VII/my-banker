const axios = require('axios');

/**
 * @function getHistoricalPrice
 * @description Fetches cryptocurrency price in USD for a specific date using CoinGecko API
 */
async function getHistoricalPrice(symbol, dateStr) {
    // Validate input
    if (!symbol) throw new Error('Symbol is required');

    try {
        // Fetch historical price data
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${symbol}/history?date=${dateStr}`);

        // Extract and return USD price
        return res.data.market_data?.current_price?.usd ?? null;
    } catch (error) {
        // Throw an error if the request fails
        throw new Error('Failed to fetch historical price: ' + error.message);
    }
}

/**
 * @function formatDate
 * @description Converts ISO date string to DD-MM-YYYY format
 */
function formatDate(dateISO) {
    // Create date object
    const d = new Date(dateISO);

    // Format day with leading zeros
    const day = String(d.getDate()).padStart(2, '0');

    // Format month with leading zeros
    const month = String(d.getMonth() + 1).padStart(2, '0');

    // Get year
    const year = d.getFullYear();

    // Return formatted date
    return `${day}-${month}-${year}`;
}

module.exports = { getHistoricalPrice, formatDate };