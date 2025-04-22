import { readFileSync } from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';

export async function generatePDF(resumeData: any, format: string): Promise<Buffer> {
  const templatePath = path.join(process.cwd(), `src/templates/${format.toLowerCase()}.hbs`);
  const template = readFileSync(templatePath, 'utf-8');
  const compiledTemplate = Handlebars.compile(template);
  const html = compiledTemplate(resumeData);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
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