import { NextResponse } from 'next/server';
import { scrapePortfolio } from '@/services/scraper';
import { generateResume } from '@/services/ai';
import { generatePDF } from '@/services/pdf';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    // Scrape portfolio
    const scrapedData = await scrapePortfolio(url);
    
    // Generate resume content
    const resumeContent = await generateResume(scrapedData, {
      resumeFormat: 'Google',
      portfolioFormat: 'Creative',
      targetIndustry: 'Tech',
      colorScheme: 'Professional'
    });

    // Generate PDF
    const pdf = await generatePDF(resumeContent, 'Google');

    return NextResponse.json({
      success: true,
      scrapedData,
      resumeContent,
      pdf: pdf.toString('base64')
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    );
  }
}