const axios = require('axios');

/**
 * Fetches cryptocurrency price in USD for a specific date from CoinGecko
 * Assumes symbol is a valid CoinGecko coin ID and dateStr is in DD-MM-YYYY format
 */
async function getHistoricalPrice(symbol, dateStr) {
    if (!symbol) throw new Error('Symbol is required');

    try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${symbol}/history?date=${dateStr}`);

        return res.data.market_data?.current_price?.usd ?? null;
    } catch (error) {
        throw new Error('Failed to fetch historical price: ' + error.message);
    }
}

/**
 * Converts date string to CoinGecko's required format
 * Assumes dateISO is a valid ISO 8601 date string
 */
function formatDate(dateISO) {
    const dateObject = new Date(dateISO);
    const day = String(dateObject.getUTCDate()).padStart(2, '0');
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0');
    const year = dateObject.getUTCFullYear();

    return `${day}-${month}-${year}`;
}

module.exports = { getHistoricalPrice, formatDate };