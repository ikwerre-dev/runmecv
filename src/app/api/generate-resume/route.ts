import { NextResponse } from 'next/server';
import { scrapePortfolio } from '@/services/scraper';
import { generateResume } from '@/services/ai';
import { generatePDF } from '@/services/pdf';
import { analyzePortfolioWithRetry } from '@/services/portfolioAnalysis';
import { logToFile } from '@/utils/logger';

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
  try {
    const { 
      portfolioUrl,
      resumeFormat = 'Google',
      portfolioFormat = 'Creative',
      needsReview = false,
      targetIndustry = 'Tech',
      colorScheme = 'Professional'
    } = await request.json();

    logToFile('generate-resume-request', JSON.stringify({
      timestamp: new Date().toISOString(),
      data: {
        portfolioUrl,
        resumeFormat,
        portfolioFormat,
        needsReview,
        targetIndustry,
        colorScheme
      }
    }));

    // Scrape portfolio
    const scrapedData = await scrapePortfolio(portfolioUrl);
    logToFile('generate-resume-scraped-data', JSON.stringify({
      timestamp: new Date().toISOString(),
      data: scrapedData
    }));
    console.log("✅ scrapping successful");

    // Generate resume content with retry
    const resumeContent = await generateResumeWithRetry(scrapedData, {
      resumeFormat,
      portfolioFormat,
      targetIndustry,
      colorScheme
    });

    // Analyze portfolio if requested
    let portfolioAnalysis = null;
    if (needsReview) {
      portfolioAnalysis = await analyzePortfolioWithRetry(scrapedData, {
        targetIndustry
      });
      logToFile('portfolio-analysis', JSON.stringify({
        timestamp: new Date().toISOString(),
        data: portfolioAnalysis
      }));
      console.log("✅ portfolio analysis successful");
    }

    // Generate PDF
    const pdf = await generatePDF(resumeContent, resumeFormat);

    return NextResponse.json({
      success: true,
      stages: {
        scraping: { completed: true, error: null },
        resumeGeneration: { completed: true, error: null },
        portfolioAnalysis: { completed: !!portfolioAnalysis, error: null },
        pdfGeneration: { completed: true, error: null }
      },
      scrapedData,
      resumeContent,
      portfolioAnalysis,
      pdf: pdf.toString('base64')
    });

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logToFile('generate-resume-error', JSON.stringify({
      timestamp: new Date().toISOString(),
      error: errorMessage
    }));

    return NextResponse.json({
      success: false,
      stages: {
        scraping: { completed: false, error: errorMessage },
        resumeGeneration: { completed: false, error: errorMessage },
        portfolioAnalysis: { completed: false, error: errorMessage },
        pdfGeneration: { completed: false, error: errorMessage }
      }
    }, { status: 500 });
  }
}