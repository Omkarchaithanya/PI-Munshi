import { chromium } from "playwright";

async function testLanguageSwitch() {
  console.log("=== Testing Multilingual Switch & Zero Hydration Errors ===");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });

  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => errors.push(err.message));

  console.log("Navigating to http://localhost:8080/ ...");
  await page.goto("http://localhost:8080/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // 1. Initial State (Hindi)
  const initialText = await page.locator("body").innerText();
  console.log("Initial contains Hindi 'कल का पेमेंट':", initialText.includes("कल का पेमेंट"));
  await page.screenshot({ path: "screenshots/dukaan-hindi.png" });

  // 2. Switch to Kannada
  console.log("Clicking Kannada (ಕನ್ನಡ) button...");
  const kannadaBtn = page.locator('button:has-text("ಕನ್ನಡ")');
  await kannadaBtn.click();
  await page.waitForTimeout(1000);

  const knText = await page.locator("body").innerText();
  const hasKannadaHeader = knText.includes("ನಿನ್ನೆಯ ಪಾವತಿ") || knText.includes("ಧ್ವನಿ ಕೇಳಿ");
  const hasKannadaCards = knText.includes("ಒಟ್ಟು ಬಿಲ್") || knText.includes("ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ");
  console.log("Kannada Translation Status:", { hasKannadaHeader, hasKannadaCards });
  await page.screenshot({ path: "screenshots/dukaan-kannada.png" });

  // Switch to Engine in Kannada
  const knEngineBtn = page.locator('button:has-text("ಜಡ್ಜ್")');
  if (await knEngineBtn.count() > 0) {
    await knEngineBtn.click();
    await page.waitForTimeout(1000);
    const knEngineText = await page.locator("body").innerText();
    console.log("Kannada Engine contains 'ನಾಲೆಡ್ಜ್':", knEngineText.includes("ನಾಲೆಡ್ಜ್") || knEngineText.includes("ಟ್ರಸ್ಟ್"));
    await page.screenshot({ path: "screenshots/engine-kannada.png" });
  }

  // 3. Switch to English
  console.log("Clicking English button...");
  const enBtn = page.locator('button:has-text("English")');
  await enBtn.click();
  await page.waitForTimeout(1000);

  const shopBtn = page.locator('button:has-text("Shop")');
  await shopBtn.click();
  await page.waitForTimeout(1000);

  const enText = await page.locator("body").innerText();
  const hasEnHeader = enText.includes("Yesterday's Payment Credited") || enText.includes("Listen Outcome Aloud");
  console.log("English Translation Status:", { hasEnHeader });
  await page.screenshot({ path: "screenshots/dukaan-english.png" });

  console.log("Total Console Errors:", errors.length);
  if (errors.length > 0) {
    console.error("Errors encountered:", errors);
  }

  await browser.close();
  console.log("=== Multilingual Switch Test Completed Successfully ===");
  if (errors.length > 0) process.exit(1);
}

testLanguageSwitch().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

