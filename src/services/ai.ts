import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';
import path from 'path';
import { logToFile } from '@/utils/logger';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const templates = JSON.parse(
  readFileSync(path.join(process.cwd(), 'src/data/resumeTemplates.json'), 'utf-8')
);

export async function generateResume(portfolioData: any, formData: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });

  const template = templates[formData.resumeFormat];
  const prompt = `
    Do not add comments to your response.
    Create a professional resume based on the following portfolio data and preferences:

    guidelines:
    for the projects section, the fileds,if it is less than 5, list all but if its atleast 5, list atleast 5 projects and at most 10 projects.
    for the skills section, list atleast 10 skills and at most 20 skills.
    for the if there is any experience section, if it is less than 5, list all but if its atleast 5, list atleast 5 experience and at most 10 experience.
    for the languages section, list atleast 1 language and at most 2 language.
    for the intro summary, let it use the available data to say a quick bio about the person especially how they are fit for the role.
    Please generate a JSON response that follows the exact structure of the template do not omit any key use exactly the structure,

    FILTER OUT ANY CHARACTER THAT WILL MAKE IT NOT COME OUT AS A VALID JSON.
    
    Portfolio Data:
    ${JSON.stringify(portfolioData, null, 2)}

    Please generate a JSON response that follows the exact structure of the template,
    
    User Preferences:
    ${JSON.stringify(formData, null, 2)}
    
    Resume Template Structure:
    ${JSON.stringify(template, null, 2)}
    Do not add comments to your response or json or output.

    RETURN AS JSON RESPONSE ONLY.
    
    Please generate a JSON response that follows the exact structure of the template,
    filling in all relevant sections with appropriate content from the portfolio data.
    Focus on ${formData.targetIndustry} industry standards and use a ${formData.colorScheme} style.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Extract JSON from code block
  const jsonContent = text.replace(/```json/g, '').replace(/```/g, '').trim();
   
  logToFile('ai-response', JSON.stringify({
    timestamp: new Date().toISOString(),
    prompt: prompt,
    result: result,
    response: response
  }, null, 2));

  return JSON.parse(jsonContent);
}