import puppeteer from 'puppeteer';

export async function scrapePortfolio(url: string) {
  const browserlessApiKey = Math.random() < 0.5
    ? process.env.BROWSERLESS_API_KEY_1
    : process.env.BROWSERLESS_API_KEY_2;

  console.log(`Using Browserless API Key: ${browserlessApiKey === process.env.BROWSERLESS_API_KEY_1 ? '1' : '2'}`);

  if (!browserlessApiKey) {
    throw new Error('Browserless API key is missing in environment variables');
  }

  // Connect to Browserless.io
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessApiKey}`,
  });
  const page = await browser.newPage();

  try {
    // Enable performance metrics
    await page.setCacheEnabled(false);
    const client = await page.target().createCDPSession();
    await client.send('Performance.enable');

    // Record timestamps
    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    const loadTime = Date.now() - startTime;

    // Collect performance metrics
    const performanceMetrics = await client.send('Performance.getMetrics');
    const metrics = await page.metrics();
    
    // Get page size and resources
    const pageSize = await page.evaluate(() => {
      return {
        documentHeight: document.documentElement.scrollHeight,
        documentWidth: document.documentElement.scrollWidth,
        totalElements: document.getElementsByTagName('*').length,
        images: document.getElementsByTagName('img').length,
        links: document.getElementsByTagName('a').length,
        scripts: document.getElementsByTagName('script').length,
        styles: document.getElementsByTagName('style').length + document.getElementsByTagName('link').length,
      };
    });

    const data = await page.evaluate(() => {
      const extractText = (selector: string) => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.textContent?.trim()).filter(Boolean);
      };

      return {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
        headings: extractText('h1, h2, h3'),
        links: Array.from(document.querySelectorAll('a')).map(a => ({
          text: a.textContent?.trim(),
          href: a.href
        })),
        mainContent: extractText('main p, article p, .content p'),
        technologies: extractText('.tech, .skills, .stack'),
        projects: Array.from(document.querySelectorAll('.project, .work, .portfolio-item')).map(proj => ({
          title: proj.querySelector('h2, h3, h4')?.textContent?.trim(),
          description: proj.querySelector('p')?.textContent?.trim(),
          link: proj.querySelector('a')?.href
        }))
      };
    });

    // Add performance metrics to the returned data
    const performanceData = {
      ...data,
      metrics: {
        loadTimeMs: loadTime,
        pageMetrics: {
          ...pageSize,
          jsHeapSize: metrics.JSHeapUsedSize 
            ? `${Math.round(metrics.JSHeapUsedSize / 1024 / 1024 * 100) / 100} MB`
            : 'Not available',
          totalMemory: metrics.JSHeapTotalSize 
            ? `${Math.round(metrics.JSHeapTotalSize / 1024 / 1024 * 100) / 100} MB`
            : 'Not available',
        },
        performance: performanceMetrics.metrics.reduce((acc: any, metric: any) => {
          acc[metric.name] = metric.value;
          return acc;
        }, {}),
      }
    };

    await browser.close();
    return performanceData;
  } catch (error) {
    await browser.close();
    throw error;
  }
}