import { GoogleGenerativeAI } from '@google/generative-ai';
import { logToFile } from '@/utils/logger';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzePortfolio(scrapedData: any, options: any) {
  try {
    const analysisPrompt = `
      Analyze this portfolio critically based on the ${options.targetIndustry} industry standards.
      limit to 2 per each
      make it fun and mix in a little bit of humor and make it funny
      use add nigerian pidgin.
      make it easy to read and understand.
      make it short and concise.
      make it funny and mix in a little bit of humor.
      make it easy to read and understand.
      Identify what's missing and what needs to be improved to get the desired job.
      Provide a strict rating out of 100 based on the portfolio's details, completeness and relevance.
      Return the response as JSON with the following structure:
      {
        "strengths": [],
        "weaknesses": [],
        "missing": [],
        "suggestions": [],
        "rating": number
      }
      Portfolio Data:
      ${JSON.stringify(scrapedData, null, 2)}
    `;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });
    const result = await model.generateContent(analysisPrompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonContent = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonContent);
  } catch (error) {
    logToFile('portfolio-analysis-error', JSON.stringify({
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }));
    throw error;
  }
}

export async function analyzePortfolioWithRetry(scrapedData: any, options: any, retries = 3, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await analyzePortfolio(scrapedData, options);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}