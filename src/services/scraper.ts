import puppeteer from 'puppeteer';

export async function scrapePortfolio(url: string) {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

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

    await browser.close();
    return data;
  } catch (error) {
    await browser.close();
    throw error;
  }
}