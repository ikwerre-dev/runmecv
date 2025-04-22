import html_to_pdf from 'html-pdf-node';
import { readFileSync } from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export async function generatePDF(resumeData: any, format: string): Promise<Buffer> {
  const templatePath = path.join(process.cwd(), `src/templates/${format.toLowerCase()}.hbs`);
  const template = readFileSync(templatePath, 'utf-8');
  const compiledTemplate = Handlebars.compile(template);
  
  const html = compiledTemplate(resumeData);
  
  const options = {
    format: 'A4',
    margin: { top: 20, bottom: 20, left: 20, right: 20 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  };
  
  const file = { content: html };
  return new Promise((resolve, reject) => {
    html_to_pdf.generatePdf(file, options, (error: Error, buffer: Buffer) => {
      if (error) {
        return reject(error);
      }
      resolve(buffer);
    });
  });
}