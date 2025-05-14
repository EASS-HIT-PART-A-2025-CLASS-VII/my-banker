// Import the axios library for making HTTP requests
const axios = require('axios');

/**
 * Fetch the historical price of a cryptocurrency for a specific date.
 * 
 * This function uses the CoinGecko API to retrieve the price of a cryptocurrency
 * in USD for a given date.
 * 
 * @param {string} symbol - The symbol of the cryptocurrency (e.g., "bitcoin").
 * @param {string} dateStr - The date in "DD-MM-YYYY" format.
 * @returns {number|null} The price in USD or null if the price is unavailable.
 * @throws {Error} Throws an error if the symbol is not provided.
 */
async function getHistoricalPrice(symbol, dateStr) {
    // Check if the symbol is provided
    if (!symbol) {
        // Throw an error if the symbol is missing
        throw new Error('Symbol is required');
    }

    try {
        // Make a GET request to the CoinGecko API to fetch historical price data
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${symbol}/history?date=${dateStr}`);
        return res.data.market_data?.current_price?.usd ?? null;
    } catch (err) {
        // Return null if an error occurs
        return null;
    }
}

/**
 * Format an ISO date string into "DD-MM-YYYY" format.
 * 
 * This function converts a date in ISO format to a human-readable format
 * suitable for use with the CoinGecko API.
 * 
 * @param {string} dateISO - The ISO date string (e.g., "2025-05-12T00:00:00Z").
 * @returns {string} The formatted date string in "DD-MM-YYYY" format.
 */
function formatDate(dateISO) {
    // Create a new Date object from the ISO date string
    const d = new Date(dateISO);
    // Extract the day and pad it with leading zeros if necessary
    const day = String(d.getDate()).padStart(2, '0');
    // Extract the month, add 1 (since months are zero-based), and pad with leading zeros
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
}

module.exports = { getHistoricalPrice, formatDate };