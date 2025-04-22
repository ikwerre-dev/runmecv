import { readFileSync } from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';

export async function generatePDF(resumeData: any, format: string): Promise<Buffer> {
  const templatePath = path.join(process.cwd(), `src/templates/${format.toLowerCase()}.hbs`);
  const template = readFileSync(templatePath, 'utf-8');
  const compiledTemplate = Handlebars.compile(template);
  const html = compiledTemplate(resumeData);

  // Read the Browserless.io API key from environment variables
  // Randomly select between BROWSERLESS_API_KEY_3 and BROWSERLESS_API_KEY_4
  const browserlessApiKey = Math.random() < 0.5 
    ? process.env.BROWSERLESS_API_KEY_3 
    : process.env.BROWSERLESS_API_KEY_4;

  console.log(`Using Browserless API Key: ${browserlessApiKey === process.env.BROWSERLESS_API_KEY_3 ? '3' : '4'}`);

  if (!browserlessApiKey) {
    throw new Error('Browserless API key is missing in environment variables');
  }

  // Connect to Browserless.io
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessApiKey}`,
  });

  const page = await browser.newPage();
  await page.setContent(html, {
    waitUntil: 'networkidle0'
  });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '20mm',
      right: '20mm'
    },
    printBackground: true
  });

  await browser.close();
  return Buffer.from(pdfBuffer);   
}