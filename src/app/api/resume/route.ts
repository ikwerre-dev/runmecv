import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/utils/db';
import { scrapePortfolio } from '@/services/scraper';
import { generateResume } from '@/services/ai';
import { generatePDF } from '@/services/pdf';

export async function POST(request: Request) {
  try {
    const { formData } = await request.json();
    const userId = uuidv4();
    const portfolioId = uuidv4();
    const resumeId = uuidv4();

    // Save user
    await db.execute(
      'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
      [userId, formData.name, formData.email]
    );

    // Scrape portfolio
    const scrapedData = await scrapePortfolio(formData.portfolioUrl);
    
    // Save portfolio data
    await db.execute(
      'INSERT INTO portfolios (id, user_id, url, scraped_data) VALUES (?, ?, ?, ?)',
      [portfolioId, userId, formData.portfolioUrl, JSON.stringify(scrapedData)]
    );

    // Generate resume content
    const resumeContent = await generateResume(scrapedData, formData);
    
    // Save resume
    await db.execute(
      'INSERT INTO resumes (id, user_id, portfolio_id, format, style, content) VALUES (?, ?, ?, ?, ?, ?)',
      [resumeId, userId, portfolioId, formData.resumeFormat, formData.portfolioFormat, JSON.stringify(resumeContent)]
    );

    // Generate PDF
    const pdf = await generatePDF(resumeContent, formData.resumeFormat);

    return NextResponse.json({
      success: true,
      resumeId,
      summary: resumeContent,
      pdf: pdf.toString('base64')
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}