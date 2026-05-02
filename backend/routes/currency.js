const express = require("express");
const axios = require("axios");
const router = express.Router();

// Simple cache to avoid hitting API limits (cache for 30 minutes)
let cache = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

router.get("/", async (req, res) => {
    try {
        const from = req.query.from || "USD";
        const to = req.query.to || "PKR";
        const apiKey = process.env.CURRENCY_API_KEY || "2820388047e73a638e9d1573";
        
        // Check cache first
        const cacheKey = `${from}`;
        if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp) < CACHE_DURATION) {
            console.log(`Using cached data for ${from}`);
            const rate = cache[cacheKey].rates[to];
            
            if (rate) {
                return res.json({
                    success: true,
                    from: from,
                    to: to,
                    conversion_rate: rate,
                    last_updated: cache[cacheKey].last_updated,
                    cached: true
                });
            }
        }
        
        console.log(`Fetching fresh currency rate: ${from} → ${to}`);
        
        // Fetch from API
        const response = await axios.get(
            `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`,
            { timeout: 10000 }
        );
        
        // Check if API request was successful
        if (response.data.result !== "success") {
            throw new Error(`API error: ${response.data.result}`);
        }
        
        const rate = response.data.conversion_rates[to];
        
        if (!rate) {
            // Return available currencies for debugging
            const availableRates = Object.keys(response.data.conversion_rates);
            return res.status(404).json({
                success: false,
                error: `Exchange rate not found for ${from} to ${to}`,
                available_currencies: availableRates.slice(0, 30),
                message: `Try one of these: ${availableRates.slice(0, 10).join(", ")}`
            });
        }
        
        // Update cache
        cache[cacheKey] = {
            rates: response.data.conversion_rates,
            last_updated: new Date(response.data.time_last_update_unix * 1000).toISOString(),
            timestamp: Date.now()
        };
        
        // Return successful response
        res.json({
            success: true,
            from: from,
            to: to,
            conversion_rate: rate,
            last_updated: new Date(response.data.time_last_update_unix * 1000).toISOString(),
            next_update: new Date(response.data.time_next_update_unix * 1000).toISOString(),
            provider: "ExchangeRate-API"
        });
        
    } catch (error) {
        console.error("Currency API error:", error.message);
        
        // Return error without mock data
        res.status(500).json({
            success: false,
            error: "Failed to fetch currency rate",
            details: error.message,
            from: req.query.from || "USD",
            to: req.query.to || "PKR",
            suggestion: "Check your API key or try again later"
        });
    }
});

// Optional: Add endpoint to get all rates for a currency
router.get("/all/:from", async (req, res) => {
    try {
        const from = req.params.from || "USD";
        const apiKey = process.env.CURRENCY_API_KEY || "2820388047e73a638e9d1573";
        
        const response = await axios.get(
            `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`,
            { timeout: 10000 }
        );
        
        if (response.data.result !== "success") {
            throw new Error(`API error: ${response.data.result}`);
        }
        
        res.json({
            success: true,
            base: from,
            rates: response.data.conversion_rates,
            last_updated: new Date(response.data.time_last_update_unix * 1000).toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;