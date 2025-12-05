import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

async function takeScreenshots() {
  // Ensure screenshots directory exists
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    console.log('Navigating to landing page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Wait for animations to settle
    await page.waitForTimeout(2000);

    // 1. Full page screenshot
    console.log('Taking full page screenshot...');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '01-landing-full.png'),
      fullPage: true,
    });

    // 2. Hero section (viewport screenshot at top)
    console.log('Taking hero section screenshot...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '02-hero-section.png'),
    });

    // 3. Scroll to stats section
    console.log('Taking stats section screenshot...');
    await page.evaluate(() => {
      const hero = document.querySelector('section');
      if (hero) {
        window.scrollTo(0, hero.getBoundingClientRect().bottom + window.scrollY - 100);
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '03-stats-section.png'),
    });

    // 4. How it works section
    console.log('Taking how-it-works section screenshot...');
    await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      // The how-it-works section is the third one (after hero and stats)
      if (sections.length >= 3) {
        sections[2].scrollIntoView({ block: 'start' });
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '04-how-it-works.png'),
    });

    // 5. Agents section (features)
    console.log('Taking agents section screenshot...');
    await page.evaluate(() => {
      const featuresSection = document.querySelector('#features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ block: 'start' });
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '05-agents-section.png'),
    });

    // 6. Strata Hub section
    console.log('Taking Strata Hub section screenshot...');
    await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      // Find the Strata Hub section (contains "Strata Hub" text)
      for (const section of sections) {
        if (section.textContent?.includes('Strata Hub Companion')) {
          section.scrollIntoView({ block: 'start' });
          break;
        }
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '06-strata-hub-section.png'),
    });

    // 7. Comparison section
    console.log('Taking comparison section screenshot...');
    await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      for (const section of sections) {
        if (section.textContent?.includes('vs Traditional Management')) {
          section.scrollIntoView({ block: 'start' });
          break;
        }
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '07-comparison-section.png'),
    });

    // 8. Savings calculator section
    console.log('Taking savings calculator screenshot...');
    await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      for (const section of sections) {
        if (section.textContent?.includes('Calculate your savings')) {
          section.scrollIntoView({ block: 'start' });
          break;
        }
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '08-savings-calculator.png'),
    });

    // 9. Pricing section
    console.log('Taking pricing section screenshot...');
    await page.evaluate(() => {
      const pricingSection = document.querySelector('#pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ block: 'start' });
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '09-pricing-section.png'),
    });

    // 10. Testimonials section
    console.log('Taking testimonials section screenshot...');
    await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      for (const section of sections) {
        if (section.textContent?.includes('What our users say')) {
          section.scrollIntoView({ block: 'start' });
          break;
        }
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '10-testimonials.png'),
    });

    // 11. FAQ section
    console.log('Taking FAQ section screenshot...');
    await page.evaluate(() => {
      const faqSection = document.querySelector('#faq');
      if (faqSection) {
        faqSection.scrollIntoView({ block: 'start' });
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '11-faq-section.png'),
    });

    // 12. CTA and Footer
    console.log('Taking CTA and footer screenshot...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '12-cta-footer.png'),
    });

    // 13. Mobile view - hero
    console.log('Taking mobile screenshots...');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '13-mobile-hero.png'),
    });

    // 14. Mobile view - full page
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '14-mobile-full.png'),
      fullPage: true,
    });

    console.log(`\n✅ Screenshots saved to: ${SCREENSHOTS_DIR}`);
    console.log('Files:');
    const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.endsWith('.png'));
    files.forEach(f => console.log(`  - ${f}`));

  } finally {
    await browser.close();
  }
}

takeScreenshots().catch(console.error);
