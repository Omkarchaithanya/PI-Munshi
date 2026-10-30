import { chromium } from "playwright";

async function runQA() {
  console.log("=== Starting Browser QA for Pi Munshi ===");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push(err.message);
  });

  console.log("Navigating to http://localhost:8080/ ...");
  await page.goto("http://localhost:8080/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const title = await page.title();
  const bodyText = await page.locator("body").innerText();
  console.log("Page Title:", title);
  console.log("Console Errors Detected:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error("Errors:", consoleErrors);
  }

  // 1. Verify Dukaan Mode elements
  const hasVoiceButton = bodyText.includes("बोलकर सुनें") || bodyText.includes("Listen Outcome Aloud") || bodyText.includes("ಧ್ವನಿ ಕೇಳಿ");
  const hasRupee = bodyText.includes("₹");
  const hasOkf = bodyText.includes("OKF") || bodyText.includes("MDR");
  console.log("Dukaan checks:", { hasVoiceButton, hasRupee, hasOkf });

  await page.screenshot({ path: "screenshots/desktop-dukaan.png" });
  console.log("Saved screenshot: screenshots/desktop-dukaan.png");

  // 2. Click Engine Mode button
  console.log("Switching to Engine & OKF Mode...");
  const engineButton = page.locator('button:has-text("OKF")');
  if (await engineButton.count() > 0) {
    await engineButton.first().click();
    await page.waitForTimeout(1000);
    const engineBodyText = await page.locator("body").innerText();
    const hasGitBacked = engineBodyText.includes("Git-Backed OKF") || engineBodyText.includes("YAML");
    const hasCanary = engineBodyText.includes("Canary");
    console.log("Engine checks:", { hasGitBacked, hasCanary });
    await page.screenshot({ path: "screenshots/desktop-engine.png" });
    console.log("Saved screenshot: screenshots/desktop-engine.png");
  }

  // 3. Mobile Viewport Check (390 x 844)
  console.log("Testing Mobile Viewport (390x844)...");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "screenshots/mobile-qa.png" });
  console.log("Saved screenshot: screenshots/mobile-qa.png");

  await browser.close();
  console.log("=== Browser QA Completed Successfully ===");
  if (consoleErrors.length > 0) {
    process.exit(1);
  }
}

runQA().catch((err) => {
  console.error("QA Failed:", err);
  process.exit(1);
});

