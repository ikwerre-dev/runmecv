import { NextResponse } from 'next/server';
import { scrapePortfolio } from '@/services/scraper';
import { generateResume } from '@/services/ai';
import { generatePDF } from '@/services/pdf';
import { logToFile } from '@/utils/logger';
import { analyzePortfolioWithRetry } from '@/services/portfolioAnalysis';

async function generateResumeWithRetry(scrapedData: any, options: any, retries = 3, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await generateResume(scrapedData, options);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function POST(request: Request) {
  const startTime = Date.now(); // Start time

  try {
    const { url } = await request.json();
    logToFile('api-request', JSON.stringify({ timestamp: new Date().toISOString(), url: url }));

    // Scrape portfolio
    const scrapedData = await scrapePortfolio(url);
    logToFile('api-scraped-data', JSON.stringify({ timestamp: new Date().toISOString(), data: scrapedData }));
    console.log("✅ scrapping successful");

    // Generate resume content with retry
    const resumeContent = await generateResumeWithRetry(scrapedData, {
      resumeFormat: 'Google',
      portfolioFormat: 'Creative',
      targetIndustry: 'Tech',
      colorScheme: 'Professional'
    });

    // Analyze portfolio with retry
    const portfolioAnalysis = await analyzePortfolioWithRetry(scrapedData, {
      targetIndustry: 'Tech'
    });
    logToFile('portfolio-analysis', JSON.stringify({ timestamp: new Date().toISOString(), data: portfolioAnalysis }));

    console.log("✅ portfolio analysis successful");

    // Generate PDF
    const pdf = await generatePDF(resumeContent, 'Google');

    const endTime = Date.now(); // End time
    const durationInSeconds = (endTime - startTime) / 1000; // Calculate duration in seconds
    console.log(durationInSeconds)

    return NextResponse.json({
      success: true,
      stages: {
        scraping: { completed: true, error: null },
        resumeGeneration: { completed: true, error: null },
        portfolioAnalysis: { completed: true, error: null },
        pdfGeneration: { completed: true, error: null }
      },
      scrapedData,
      resumeContent,
      portfolioAnalysis,
      pdf: pdf.toString('base64'),
      durationInSeconds // Add duration to the response
    });

  } catch (error) {
    const endTime = Date.now(); // End time
    const durationInSeconds = (endTime - startTime) / 1000; // Calculate duration in seconds


    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logToFile('api-error', JSON.stringify({ timestamp: new Date().toISOString(), error: errorMessage }));
    console.log(durationInSeconds)
    return NextResponse.json({
      success: false,
      stages: {
        scraping: { completed: false, error: errorMessage },
        resumeGeneration: { completed: false, error: errorMessage },
        pdfGeneration: { completed: false, error: errorMessage },
        portfolioAnalysis: { completed: false, error: errorMessage }
      },
      durationInSeconds // Add duration to the response
    }, { status: 500 });
  }
}