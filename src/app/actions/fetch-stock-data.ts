
'use server';

import { z } from 'zod';

const StockDataSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  changePercent: z.string().optional(), // e.g., "+1.23%"
});
export type StockData = z.infer<typeof StockDataSchema>;

// This interface matches the relevant parts of the Alpha Vantage GLOBAL_QUOTE response
interface AlphaVantageGlobalQuoteResponse {
  'Global Quote'?: {
    '01. symbol': string;
    '05. price': string;
    '02. open'?: string;
    '03. high'?: string;
    '04. low'?: string;
    '06. volume'?: string;
    '07. latest trading day'?: string;
    '08. previous close'?: string;
    '09. change'?: string;
    '10. change percent'?: string;
  };
  'Note'?: string; // For API limit messages
  'Error Message'?: string; // For other API errors
}

export async function fetchStockData(symbol: string): Promise<{ data?: StockData; error?: string }> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    console.error('Alpha Vantage API key is missing. Please set ALPHA_VANTAGE_API_KEY in your .env file.');
    return { error: 'API key for stock data is not configured.' };
  }

  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 60 } }); // Cache for 1 minute
    if (!response.ok) {
      console.error(`API request failed for ${symbol} with status ${response.status}`);
      return { error: `API request failed (${response.status})` };
    }
    const data: AlphaVantageGlobalQuoteResponse = await response.json();

    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      const quote = data['Global Quote'];
      return {
        data: {
          symbol: quote['01. symbol'],
          price: parseFloat(quote['05. price']),
          changePercent: quote['10. change percent'],
        }
      };
    } else if (data['Note']) {
      console.warn(`Alpha Vantage API Note for ${symbol}: ${data['Note']}`);
      return { error: `API limit likely hit for ${symbol}.` };
    } else if (data['Error Message']) {
      console.warn(`Alpha Vantage API Error for ${symbol}: ${data['Error Message']}`);
      return { error: `Invalid symbol or API error for ${symbol}.` };
    } else {
      console.warn(`Unexpected API response for ${symbol}:`, data);
      return { error: `Could not fetch price for ${symbol}.` };
    }
  } catch (err) {
    console.error(`Error fetching stock data for ${symbol}:`, err);
    // Don't expose detailed error messages to the client for security
    return { error: `Failed to fetch data for ${symbol}.` };
  }
}
