import { NextResponse } from 'next/server';
import { scrapePortfolio } from '@/services/scraper';
import { generateResume } from '@/services/ai';
import { generatePDF } from '@/services/pdf';
import { logToFile } from '@/utils/logger';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    logToFile('api-request', JSON.stringify({ timestamp: new Date().toISOString(), url: url }));

    // Scrape portfolio
    const scrapedData = await scrapePortfolio(url);
    logToFile('api-scraped-data', JSON.stringify({ timestamp: new Date().toISOString(), data: scrapedData }));
    console.log("✅ scrapping successful");

    // Generate resume content
    const resumeContent = await generateResume(scrapedData, {
      resumeFormat: 'Google',
      portfolioFormat: 'Creative',
      targetIndustry: 'Tech',
      colorScheme: 'Professional'
    });
    logToFile('api-resume-content', JSON.stringify({ timestamp: new Date().toISOString(), content: resumeContent }));
    console.log("✅ resume content generated");

    // Generate PDF
    const pdf = await generatePDF(resumeContent, 'Google');
    console.log("✅ pdf generated");

    return NextResponse.json({
      success: true,
      stages: {
        scraping: { completed: true, error: null },
        resumeGeneration: { completed: true, error: null },
        pdfGeneration: { completed: true, error: null }
      },
      scrapedData,
      resumeContent,
      pdf: pdf.toString('base64')
    });

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logToFile('api-error', JSON.stringify({ timestamp: new Date().toISOString(), error: errorMessage }));

    return NextResponse.json({
      success: false,
      stages: {
        scraping: { completed: false, error: errorMessage },
        resumeGeneration: { completed: false, error: errorMessage },
        pdfGeneration: { completed: false, error: errorMessage }
      }
    }, { status: 500 });
  }
}