import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const templates = JSON.parse(
  readFileSync(path.join(process.cwd(), 'src/data/resumeTemplates.json'), 'utf-8')
);

export async function generateResume(portfolioData: any, formData: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const template = templates[formData.resumeFormat];
  const prompt = `
    Create a professional resume based on the following portfolio data and preferences:
    
    Portfolio Data:
    ${JSON.stringify(portfolioData, null, 2)}
    
    User Preferences:
    ${JSON.stringify(formData, null, 2)}
    
    Resume Template Structure:
    ${JSON.stringify(template, null, 2)}
    
    Please generate a JSON response that follows the exact structure of the template,
    filling in all relevant sections with appropriate content from the portfolio data.
    Focus on ${formData.targetIndustry} industry standards and use a ${formData.colorScheme} style.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}